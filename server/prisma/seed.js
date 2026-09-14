import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialTopics = [
  {
    topicName: "AI Innovation",
    requirements: "Develop a next-generation AI solution or agent framework that solves a complex real-world workflow problem. Focus on accuracy, speed, and clean UX."
  },
  {
    topicName: "Smart Campus",
    requirements: "Build an integrated campus management ecosystem for automated resource allocation, event discovery, dynamic scheduling, and smart attendance tracking."
  },
  {
    topicName: "Future of Education",
    requirements: "Design an adaptive learning platform utilizing interactive visualizations, personalized skill mapping, and gamified mastery paths for higher education."
  },
  {
    topicName: "Digital Safety",
    requirements: "Create a proactive defense mechanism or browser extension that detects phishing attempts, malicious scripts, and fake online identities in real-time."
  },
  {
    topicName: "Sustainable Tech",
    requirements: "Engineering a carbon footprint tracker, smart energy management dashboard, or circular economy platform for urban communities."
  },
  {
    topicName: "Smart Healthcare",
    requirements: "Develop a remote patient monitoring dashboard with automated triage, vital sign anomaly detection, and instant emergency dispatch alerts."
  },
  {
    topicName: "FinTech Innovation",
    requirements: "Build a micro-investment engine, automated expense auditor, or secure peer-to-peer settlement platform with transparent audit logging."
  },
  {
    topicName: "Future Mobility",
    requirements: "Create a smart traffic management simulation or shared electric vehicle routing engine optimizing transit times and charging efficiency."
  },
  {
    topicName: "Social Impact Tech",
    requirements: "Design a decentralized platform connecting local food donors with community shelters, featuring real-time logistics and impact analytics."
  },
  {
    topicName: "Cyber Security",
    requirements: "Build a real-time log analysis and intrusion detection dashboard that visualizes threat vectors, blocks brute force attempts, and isolates leaks."
  }
];

async function main() {
  console.log("Seeding initial topics...");
  
  // Clear existing topics & assignments if needed
  await prisma.assignment.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.participant.deleteMany({});

  for (const t of initialTopics) {
    await prisma.topic.create({
      data: {
        topicName: t.topicName,
        requirements: t.requirements,
        status: 'AVAILABLE'
      }
    });
  }

  console.log(`Successfully seeded ${initialTopics.length} topics!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
