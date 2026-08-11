import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  const owner = await prisma.user.upsert({
    where: {
      email: "owner@stillwateryoga.test",
    },
    update: {},
    create: {
      name: "Stillwater Owner",
      email: "owner@stillwateryoga.test",
      passwordHash: "DEV_ONLY_REPLACE_WITH_REAL_HASH",
      role: "OWNER",
    },
  });

  const members = await Promise.all([
    prisma.user.upsert({
      where: {
        email: "sarah@stillwateryoga.test",
      },
      update: {},
      create: {
        name: "Sarah Mitchell",
        email: "sarah@stillwateryoga.test",
        passwordHash: "DEV_ONLY_REPLACE_WITH_REAL_HASH",
        role: "MEMBER",
      },
    }),

    prisma.user.upsert({
      where: {
        email: "james@stillwateryoga.test",
      },
      update: {},
      create: {
        name: "James Carter",
        email: "james@stillwateryoga.test",
        passwordHash: "DEV_ONLY_REPLACE_WITH_REAL_HASH",
        role: "MEMBER",
      },
    }),
  ]);

  const products = await Promise.all([
    prisma.product.upsert({
      where: {
        id: "drop-in-class",
      },
      update: {},
      create: {
        id: "drop-in-class",
        name: "Drop-In Class",
        description: "Single class access.",
        type: "DROP_IN",
        priceCents: 2500,
        currency: "CAD",
      },
    }),

    prisma.product.upsert({
      where: {
        id: "ten-class-pass",
      },
      update: {},
      create: {
        id: "ten-class-pass",
        name: "10-Class Pass",
        description: "Ten yoga classes to use at your own pace.",
        type: "CLASS_PASS",
        priceCents: 20000,
        currency: "CAD",
      },
    }),

    prisma.product.upsert({
      where: {
        id: "monthly-membership",
      },
      update: {},
      create: {
        id: "monthly-membership",
        name: "Monthly Membership",
        description: "Unlimited classes for one month.",
        type: "MONTHLY_MEMBERSHIP",
        priceCents: 12000,
        currency: "CAD",
      },
    }),
    prisma.product.upsert({
        where: {
        id: "annual-membership",
        },
        update: {},
        create: {
        id: "annual-membership",
        name: "Annual Membership",
        description: "Unlimited classes for one year.",
        type: "ANNUAL_MEMBERSHIP",
        priceCents: 120000,
        currency: "CAD",
        },
    }),
  ]);

  const now = new Date();

  const classes = [
  {
    name: 'Morning Flow',
    description:
      'A balanced flow to start your morning with energy and intention.',
    instructorName: 'Maya Chen',
    level: 'ALL_LEVELS' as const,
    startAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
    capacity: 18,
  },
  {
    name: 'Gentle Yoga',
    description:
      'A slower-paced practice focused on mobility, breath, and relaxation.',
    instructorName: 'Sarah Bennett',
    level: 'BEGINNER' as const,
    startAt: new Date(now.getTime() + 26 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() + 27 * 60 * 60 * 1000),
    capacity: 16,
  },
  {
    name: 'Power Vinyasa',
    description:
      'An energizing vinyasa practice for strength and focus.',
    instructorName: 'Maya Chen',
    level: 'INTERMEDIATE' as const,
    startAt: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() + 49 * 60 * 60 * 1000),
    capacity: 20,
  },
  {
    name: 'Yin & Restore',
    description:
      'A quiet evening practice designed to release tension and encourage deep rest.',
    instructorName: 'Emma Wilson',
    level: 'ALL_LEVELS' as const,
    startAt: new Date(now.getTime() + 50 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() + 51 * 60 * 60 * 1000),
    capacity: 15,
  },
  {
    name: 'Weekend Flow',
    description:
      'A welcoming weekend practice suitable for a range of experience levels.',
    instructorName: 'Sarah Bennett',
    level: 'ALL_LEVELS' as const,
    startAt: new Date(now.getTime() + 72 * 60 * 60 * 1000),
    endAt: new Date(now.getTime() + 73 * 60 * 60 * 1000),
    capacity: 20,
  },
];


  await prisma.class.deleteMany();

  for (const yogaClass of classes) {
    await prisma.class.create({
      data: {
        ...yogaClass,
        createdById: owner.id,
      },
    });
  }

  console.log(`Created owner: ${owner.email}`);
  console.log(`Created members: ${members.length}`);
  console.log(`Created products: ${products.length}`);
  console.log(`Created classes: ${classes.length}`);

  console.log("🌱 Database seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });