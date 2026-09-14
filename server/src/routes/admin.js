import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// All Admin routes require admin authentication
router.use(authenticateAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalParticipants = await prisma.participant.count();
    const totalTopics = await prisma.topic.count();
    const assignedTopics = await prisma.topic.count({ where: { status: 'ASSIGNED' } });
    const remainingTopics = Math.max(0, totalTopics - assignedTopics);

    res.json({
      totalParticipants,
      totalTopics,
      assignedTopics,
      remainingTopics
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to calculate statistics' });
  }
});

// GET /api/admin/participants
router.get('/participants', async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search && search.trim()) {
      const q = search.trim();
      whereClause = {
        OR: [
          { name: { contains: q } },
          { college: { contains: q } }
        ]
      };
    }

    const participants = await prisma.participant.findMany({
      where: whereClause,
      include: {
        assignment: {
          include: {
            topic: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(participants);
  } catch (error) {
    console.error('Admin fetch participants error:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// GET /api/admin/topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      include: {
        assignment: {
          include: {
            participant: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    res.json(topics);
  } catch (error) {
    console.error('Admin fetch topics error:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// POST /api/admin/topics (Add Topic)
router.post('/topics', async (req, res) => {
  try {
    const { topicName, requirements } = req.body;
    if (!topicName || !requirements) {
      return res.status(400).json({ error: 'Topic Name and Requirements are required' });
    }

    const topic = await prisma.topic.create({
      data: {
        topicName: topicName.trim(),
        requirements: requirements.trim(),
        status: 'AVAILABLE'
      }
    });

    res.status(201).json(topic);
  } catch (error) {
    console.error('Add topic error:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// PUT /api/admin/topics/:id (Edit Topic)
router.put('/topics/:id', async (req, res) => {
  try {
    const topicId = parseInt(req.params.id);
    const { topicName, requirements } = req.body;

    if (!topicName || !requirements) {
      return res.status(400).json({ error: 'Topic Name and Requirements are required' });
    }

    const updated = await prisma.topic.update({
      where: { id: topicId },
      data: {
        topicName: topicName.trim(),
        requirements: requirements.trim()
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Edit topic error:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// DELETE /api/admin/topics/:id (Delete Topic)
router.delete('/topics/:id', async (req, res) => {
  try {
    const topicId = parseInt(req.params.id);

    // Delete topic (Cascade will handle assignment if exists)
    await prisma.topic.delete({
      where: { id: topicId }
    });

    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// POST /api/admin/reset-assignment/:id (Reset assignment by participant ID)
router.post('/reset-assignment/:id', async (req, res) => {
  try {
    const participantId = parseInt(req.params.id);

    await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.findUnique({
        where: { participantId }
      });

      if (assignment) {
        // Set topic back to AVAILABLE
        await tx.topic.update({
          where: { id: assignment.topicId },
          data: { status: 'AVAILABLE' }
        });

        // Delete assignment record
        await tx.assignment.delete({
          where: { participantId }
        });
      }
    });

    res.json({ message: 'Participant assignment reset successfully' });
  } catch (error) {
    console.error('Reset assignment error:', error);
    res.status(500).json({ error: 'Failed to reset assignment' });
  }
});

// GET /api/admin/export (Export CSV)
router.get('/export', async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        participant: true,
        topic: true
      },
      orderBy: { assignedAt: 'desc' }
    });

    let csvContent = "Participant ID,Participant Name,College Name,Topic ID,Topic Name,Assigned Time\n";

    assignments.forEach(a => {
      const pId = a.participant.id;
      const pName = `"${a.participant.name.replace(/"/g, '""')}"`;
      const pCollege = `"${a.participant.college.replace(/"/g, '""')}"`;
      const tId = a.topic.id;
      const tName = `"${a.topic.topicName.replace(/"/g, '""')}"`;
      const assignedAt = `"${new Date(a.assignedAt).toLocaleString()}"`;

      csvContent += `${pId},${pName},${pCollege},${tId},${tName},${assignedAt}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=doppelganger_assignments.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Failed to generate CSV export' });
  }
});

export default router;
