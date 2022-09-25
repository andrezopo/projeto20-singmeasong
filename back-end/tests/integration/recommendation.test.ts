import supertest from "supertest";
import app from "../../src/app";
import {
  insertMultipleRecommendationsFactory,
  integrationRecommendationFactory,
} from "../factories/recommendationFactory";
import pkg from "@prisma/client";
import { Recommendation } from "@prisma/client";

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

describe("GET /recommendations", () => {
  it("Must return status 200 and return array with first item being the inserted one", async () => {
    const createdRecommendation = integrationRecommendationFactory("created");

    const dbRecommendation = await prisma.recommendation.create({
      data: createdRecommendation,
    });

    const result = await server.get("/recommendations");

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
    expect(result.body[0]).toEqual(dbRecommendation);
  });
});

describe("GET /recommendations/:id", () => {
  it("Must return status 200 and return the inserted recommendation", async () => {
    const createdRecommendation = integrationRecommendationFactory("created");

    const dbRecommendation = await prisma.recommendation.create({
      data: createdRecommendation,
    });

    const result = await server.get(`/recommendations/${dbRecommendation.id}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(dbRecommendation);
  });

  it("Must return status 404 for passing non existent id", async () => {
    const result = await server.get(`/recommendations/999`);

    expect(result.status).toBe(404);
  });
});

describe("GET /recommendations/random", () => {
  it("Must return status 200 and return random recommendation", async () => {
    await insertMultipleRecommendationsFactory();

    const result = await server.get("/recommendations/random");

    expect(result.status).toBe(200);

    expect(result.body.id).not.toBeFalsy();
  });

  it("Must return status 404 and do not return any object", async () => {
    const result = await server.get("/recommendations/random");

    expect(result.status).toBe(404);

    expect(result.body.id).toBeFalsy();
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("Must return status 200 and return the amount of recommmendations in descendent order", async () => {
    await insertMultipleRecommendationsFactory();

    const amount = 5;

    const result = await server.get(`/recommendations/top/${amount}`);

    expect(result.status).toBe(200);

    expect(result.body).toHaveLength(5);

    expect(result.body[0].score).toBeGreaterThanOrEqual(result.body[1].score);
    expect(result.body[1].score).toBeGreaterThanOrEqual(result.body[2].score);
    expect(result.body[2].score).toBeGreaterThanOrEqual(result.body[3].score);
    expect(result.body[3].score).toBeGreaterThanOrEqual(result.body[4].score);
  });
});
