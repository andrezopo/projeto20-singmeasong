describe("Test navigation through pages", () => {
  it("Test going from homepage to top recommendations page", async () => {
    cy.intercept("GET", `/recommendations`).as("getContent");
    cy.visit("/");
    cy.wait("@getContent");

    cy.contains("Top").click();

    cy.wait(2000);

    cy.url().should("equal", "http://localhost:3000/top");

    cy.contains("Random").click();

    cy.wait(2000);

    cy.url().should("equal", "http://localhost:3000/random");

    cy.contains("Home").click();

    cy.wait(2000);

    cy.url().should("equal", "http://localhost:3000/");
  });
});
