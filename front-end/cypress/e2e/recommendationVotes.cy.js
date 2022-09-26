describe("Test upvote and downvote", () => {
  it("Test upvote and downvote", async () => {
    cy.visit("/");

    cy.get("#votes")
      .invoke("text")
      .then((text1) => {
        cy.get("#upArrow").click();

        cy.get("#votes")
          .invoke("text")
          .should((text2) => {
            expect(parseFloat(text1) + 1).to.eq(parseFloat(text2));
          });
      });

    cy.wait(1000);

    cy.get("#votes")
      .invoke("text")
      .then((text1) => {
        cy.get("#downArrow").click();

        cy.get("#votes")
          .invoke("text")
          .should((text2) => {
            expect(parseFloat(text1) - 1).to.eq(parseFloat(text2));
          });
      });
  });
});
