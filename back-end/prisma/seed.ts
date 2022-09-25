import { faker } from "@faker-js/faker";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  await insertMultipleRecommendations();
}

function createRecommendation() {
  return {
    name: faker.lorem.words(2),
    youtubeLink: `https://www.youtube.com/${faker.lorem.word()}`,
    score: faker.datatype.number({ min: -5, max: 25 }),
  };
}

async function insertMultipleRecommendations() {
  for (let i = 0; i < 10; i++) {
    await prisma.recommendation.create({
      data: createRecommendation(),
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
