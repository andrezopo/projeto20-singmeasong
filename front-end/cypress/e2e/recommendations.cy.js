const app = "http://localhost:3000";
describe("Recommendations homepage", () => {
  it("Visit the project homepage", async () => {
    cy.visit(app);
  });
});
