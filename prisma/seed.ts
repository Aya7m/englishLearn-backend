import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.level.createMany({
    data: [
      {
        title: 'Survival Island',
        code: 'A1',
        description: 'Basic English for beginners',
        order: 1,
      },
      {
        title: 'Daily Life City',
        code: 'A2',
        description: 'English for daily situations',
        order: 2,
      },
      {
        title: 'Conversation Town',
        code: 'B1',
        description: 'Intermediate conversations',
        order: 3,
      },
      {
        title: 'Work English Hub',
        code: 'B2',
        description: 'English for work and interviews',
        order: 4,
      },
      {
        title: 'Professional Arena',
        code: 'C1',
        description: 'Advanced professional English',
        order: 5,
      },
    ],
    skipDuplicates: true,
  });

  const a1 = await prisma.level.findUnique({
    where: { code: 'A1' },
  });

  if (a1) {
    const mission1 = await prisma.mission.create({
      data: {
        title: 'Introduce Yourself',
        description: 'Learn how to introduce yourself in English',
        content: 'My name is Aya. I am from Egypt.',
        xpReward: 10,
        order: 1,
        levelId: a1.id,
      },
    });

    const mission2 = await prisma.mission.create({
      data: {
        title: 'Basic Greetings',
        description: 'Learn common English greetings',
        content: 'Hello, Good morning, Good evening.',
        xpReward: 15,
        order: 2,
        levelId: a1.id,
      },
    });

    await prisma.question.create({
      data: {
        text: 'How do you say مرحبا in English?',
        order: 1,
        missionId: mission1.id,
        options: {
          create: [
            { text: 'Bye', isCorrect: false },
            { text: 'Hello', isCorrect: true },
            { text: 'Thanks', isCorrect: false },
            { text: 'Night', isCorrect: false },
          ],
        },
      },
    });

    await prisma.question.create({
      data: {
        text: 'Choose a greeting',
        order: 1,
        missionId: mission2.id,
        options: {
          create: [
            { text: 'Apple', isCorrect: false },
            { text: 'Morning', isCorrect: false },
            { text: 'Hello', isCorrect: true },
            { text: 'Chair', isCorrect: false },
          ],
        },
      },
    });
  }

  await prisma.badge.createMany({
    data: [
      {
        name: 'First Mission Completed',
        description: 'Complete your first mission',
        icon: '🎯',
      },

      {
        name: '100 XP Earned',
        description: 'Earn 100 XP',
        icon: '⭐',
      },

      {
        name: 'A1 Master',
        description: 'Complete all A1 missions',
        icon: '🏝️',
      },
      {
        name: 'Daily Goal Completed',
        description: 'Complete 3 missions in one day',
        icon: '🎯',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
