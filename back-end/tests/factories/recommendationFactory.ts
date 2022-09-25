import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

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
      name: faker.lorem.word(),
      youtubeLink: `https://www.youtube.com/${faker.lorem.word()}`,
    };
  }
  if (status === "created") {
    return {
      name: faker.lorem.word(),
      youtubeLink: `https://www.youtube.com/${faker.lorem.word()}`,
      score: 0,
    };
  }
}
