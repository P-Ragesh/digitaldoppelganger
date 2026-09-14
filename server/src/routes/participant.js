import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateParticipant } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get list of topics (for the wheel display)
router.get('/topics', async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(topics);
  } catch (error) {
    console.error('Fetch topics error:', error);
    res.status(500).json({ error: 'Failed to retrieve topics' });
  }
});

// Get logged-in participant details
router.get('/participant/me', authenticateParticipant, async (req, res) => {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id: req.participant.id },
      include: {
        assignment: {
          include: {
            topic: true
          }
        }
      }
    });

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json(participant);
  } catch (error) {
    console.error('Participant me error:', error);
    res.status(500).json({ error: 'Failed to fetch participant info' });
  }
});

// Get logged-in participant assignment
router.get('/participant/assignment', authenticateParticipant, async (req, res) => {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { participantId: req.participant.id },
      include: {
        topic: true,
        participant: true
      }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'No topic assigned yet' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Participant assignment error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

export default router;
