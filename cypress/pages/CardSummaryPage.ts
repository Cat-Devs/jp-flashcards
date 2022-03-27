class CardSummaryPage {
  open() {
    cy.visit('/shuffle/summary');
  }

  shouldBeOpen() {
    cy.get('[data-cy="card-summary-wrap"]').should('be.visible');
  }
}

export default new CardSummaryPage();
