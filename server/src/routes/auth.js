import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();
const prisma = new PrismaClient();

// Participant Login
router.post('/login', async (req, res) => {
  try {
    let { name, college } = req.body;

    if (!name || !college) {
      return res.status(400).json({ error: 'Both Participant Name and College Name are required.' });
    }

    name = name.trim();
    college = college.trim();

    if (name.length === 0 || college.length === 0) {
      return res.status(400).json({ error: 'Name and College cannot be empty or only spaces.' });
    }

    // Check if participant already exists with exact Name + College combination
    let participant = await prisma.participant.findFirst({
      where: {
        name: { equals: name },
        college: { equals: college }
      },
      include: {
        assignment: {
          include: {
            topic: true
          }
        }
      }
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          name,
          college
        },
        include: {
          assignment: {
            include: {
              topic: true
            }
          }
        }
      });
    }

    const token = generateToken({
      id: participant.id,
      name: participant.name,
      college: participant.college,
      role: 'participant'
    });

    return res.json({
      token,
      participant: {
        id: participant.id,
        name: participant.name,
        college: participant.college,
        createdAt: participant.createdAt,
        assignment: participant.assignment ? {
          id: participant.assignment.id,
          assignedAt: participant.assignment.assignedAt,
          topic: participant.assignment.topic
        } : null
      }
    });
  } catch (error) {
    console.error('Participant Login Error:', error);
    return res.status(500).json({ error: 'Server error during participant login.' });
  }
});

// Admin Login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'adminpassword123';

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  if (username.trim() === adminUser && password.trim() === adminPass) {
    const token = generateToken({
      username: adminUser,
      role: 'admin'
    });
    return res.json({ token, username: adminUser });
  } else {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }
});

export default router;
