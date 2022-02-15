describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the home page', () => {
    cy.contains('Japanese Flashcards');
  });

  it('should render a login button', () => {
    expect(cy.get('[data-cy=login]')).to.exist;
  });

  it('should render a flashcard', () => {
    cy.visit('/cards/10001');
    expect(cy.get('[data-cy=flashcard]')).to.exist;
  });

  it('should render a flashcard not found', () => {
    cy.visit('/cards/xxx');
    expect(cy.get('[data-cy=flashcard-not-found]')).to.exist;
  });
});
