import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export function recommendationFactory() {
  const recommendation: CreateRecommendationData = {
    name: faker.lorem.word(),
    youtubeLink: `https://www.youtube.com/${faker.lorem.word()}`,
  };

  return recommendation;
}

export function integrationRecommendationFactory(
  status: "creating" | "created"
) {
  if (status === "creating") {
    return {
      name: faker.lorem.words(2),
      youtubeLink: `https://www.youtube.com/${faker.lorem.word()}`,
    };
  }
  if (status === "created") {
    return {
      name: faker.lorem.words(2),
      youtubeLink: `https://www.youtube.com/${faker.lorem.word()}`,
      score: faker.datatype.number({ min: -5, max: 25 }),
    };
  }
}

export async function insertMultipleRecommendationsFactory() {
  for (let i = 0; i < 10; i++) {
    await prisma.recommendation.create({
      data: integrationRecommendationFactory("created"),
    });
  }
}
