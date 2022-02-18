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
});
