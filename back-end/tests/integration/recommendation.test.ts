import supertest from "supertest";
import app from "../../src/app";
import { integrationRecommendationFactory } from "../factories/recommendationFactory";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const server = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`
    TRUNCATE recommendations RESTART IDENTITY
    `;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /recommendations", () => {
  it("Must return status 201 and created item in database", async () => {
    const recommendation = integrationRecommendationFactory("creating");

    const result = await server.post("/recommendations").send(recommendation);

    const dbResult = await prisma.recommendation.findUnique({
      where: { name: recommendation.name },
    });

    expect(result.status).toBe(201);
    expect(dbResult).toMatchObject(recommendation);
  });

  it("Must return status 422 and do not create item in database", async () => {
    const recommendation = {};

    const result = await server.post("/recommendations").send(recommendation);

    const dbResult = await prisma.recommendation.findMany();

    expect(result.status).toBe(422);
    expect(dbResult.length).toBe(0);
  });
});

describe("POST /recommendations/:id/upvote", () => {
  it("Must return status 200 and increase score by 1 in database item", async () => {
    const createdRecommendation = integrationRecommendationFactory("created");

    const dbRecommendation = await prisma.recommendation.create({
      data: createdRecommendation,
    });

    const result = await server.post(
      `/recommendations/${dbRecommendation.id}/upvote`
    );

    const dbResult = await prisma.recommendation.findUnique({
      where: { name: dbRecommendation.name },
    });

    expect(result.status).toBe(200);
    expect(dbResult.score).toBe(dbRecommendation.score + 1);
  });

  it("Must return status 404 for passing non existent id", async () => {
    const result = await server.post("/recommendations/999/upvote");

    expect(result.status).toBe(404);
  });
});

describe("POST /recommendations/:id/downvote", () => {
  it("Must return status 200 and decrease score by 1 in database item", async () => {
    const createdRecommendation = integrationRecommendationFactory("created");

    const dbRecommendation = await prisma.recommendation.create({
      data: createdRecommendation,
    });

    const result = await server.post(
      `/recommendations/${dbRecommendation.id}/downvote`
    );

    const dbResult = await prisma.recommendation.findUnique({
      where: { name: dbRecommendation.name },
    });

    expect(result.status).toBe(200);
    expect(dbResult.score).toBe(dbRecommendation.score - 1);
  });

  it("Must delete item from database for having score under -5", async () => {
    const createdRecommendation = integrationRecommendationFactory("created");
    createdRecommendation.score = -5;

    const dbRecommendation = await prisma.recommendation.create({
      data: createdRecommendation,
    });

    const result = await server.post(
      `/recommendations/${dbRecommendation.id}/downvote`
    );

    const dbResult = await prisma.recommendation.findUnique({
      where: { name: dbRecommendation.name },
    });

    expect(result.status).toBe(200);
    expect(dbResult).toBeNull();
  });

  it("Must return status 404 for passing non existent id", async () => {
    const result = await server.post("/recommendations/999/downvote");

    expect(result.status).toBe(404);
  });
});
