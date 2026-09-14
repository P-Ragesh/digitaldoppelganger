import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateParticipant } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const prisma = new PrismaClient();

const spinLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 3,
  message: { error: 'Spin request in progress. Please wait.' }
});

router.post('/spin', authenticateParticipant, spinLimiter, async (req, res) => {
  const participantId = req.participant.id;

  try {
    // Perform spin assignment inside an atomic Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if participant already has an assignment
      const existingAssignment = await tx.assignment.findUnique({
        where: { participantId },
        include: { topic: true }
      });

      if (existingAssignment) {
        // Find segment index among all topics
        const allTopics = await tx.topic.findMany({ orderBy: { id: 'asc' } });
        const segIdx = allTopics.findIndex(t => t.id === existingAssignment.topicId);

        return {
          alreadyAssigned: true,
          topicId: existingAssignment.topic.id,
          topicName: existingAssignment.topic.topicName,
          requirements: existingAssignment.topic.requirements,
          segmentIndex: segIdx >= 0 ? segIdx : 0,
          assignedAt: existingAssignment.assignedAt
        };
      }

      // 2. Query available topics
      const availableTopics = await tx.topic.findMany({
        where: { status: 'AVAILABLE' }
      });

      if (availableTopics.length === 0) {
        throw new Error('ALL_TOPICS_ASSIGNED');
      }

      // 3. Randomly select one available topic
      const randomIndex = Math.floor(Math.random() * availableTopics.length);
      const selectedTopic = availableTopics[randomIndex];

      // 4. Update topic status to ASSIGNED
      await tx.topic.update({
        where: { id: selectedTopic.id },
        data: { status: 'ASSIGNED' }
      });

      // 5. Create Assignment
      const newAssignment = await tx.assignment.create({
        data: {
          participantId,
          topicId: selectedTopic.id
        }
      });

      // 6. Find segment index in the full topic array (ordered by id asc)
      const allTopics = await tx.topic.findMany({ orderBy: { id: 'asc' } });
      const segIdx = allTopics.findIndex(t => t.id === selectedTopic.id);

      return {
        alreadyAssigned: false,
        topicId: selectedTopic.id,
        topicName: selectedTopic.topicName,
        requirements: selectedTopic.requirements,
        segmentIndex: segIdx >= 0 ? segIdx : 0,
        assignedAt: newAssignment.assignedAt
      };
    });

    return res.json(result);

  } catch (error) {
    if (error.message === 'ALL_TOPICS_ASSIGNED') {
      return res.status(400).json({ error: 'All topics have been assigned.' });
    }

    console.error('Spin execution error:', error);
    return res.status(500).json({ error: 'Failed to process topic spin assignment. Please try again.' });
  }
});

export default router;
