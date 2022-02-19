describe('Cards', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render a flashcard', () => {
    cy.visit('/cards/101002');
    cy.dataCy('flashcard');
  });

  it('should render a flashcard not found', () => {
    cy.visit('/cards/xxx');
    cy.dataCy('flashcard-not-found');
  });
});
