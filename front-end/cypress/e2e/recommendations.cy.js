import { faker } from "@faker-js/faker";

const app = "http://localhost:3000";
describe("Recommendations homepage", () => {
  it("Visit the project homepage and get recommendations", async () => {
    cy.intercept("GET", `/recommendations`).as("getContent");
    cy.visit(app);
    cy.wait("@getContent");

    cy.url().should("equal", `http://localhost:5000/`);
  });
});

describe("Test route /recommendations", () => {
  it("Create a recommendation", () => {
    const recommendation = {
      name: faker.name.jobTitle(),
      youtubeLink: "https://www.youtube.com/watch?v=rEXaOmkuHkI&t=780s",
    };
    cy.intercept("GET", `/recommendations`).as("getContent");
    cy.visit(app);
    cy.wait("@getContent");

    cy.get("#name").type(recommendation.name);
    cy.get("#link").type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("createNew");
    cy.get("#submitButton").click();
    cy.wait("@createNew");

    cy.contains(recommendation.name).should("be.visible");
  });
});
