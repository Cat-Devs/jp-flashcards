describe('Cards', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render a flashcard', () => {
    cy.visit('/cards/101002');
    cy.get('[data-cy=flashcard]').should('exist');
  });

  it('should render a flashcard not found', () => {
    cy.visit('/cards/xxx');
    cy.get('[data-cy=flashcard-not-found]').should('exist');
  });
});
