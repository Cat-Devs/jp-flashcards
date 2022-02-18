describe('Cards', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render a flashcard', () => {
    cy.visit('/cards/101002');
    expect(cy.get('[data-cy=flashcard]')).to.exist;
  });

  it('should render a flashcard not found', () => {
    cy.visit('/cards/xxx');
    expect(cy.get('[data-cy=flashcard-not-found]')).to.exist;
  });
});
