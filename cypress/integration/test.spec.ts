describe('Test', () => {
  it('works', () => {
    cy.visit('/');
    cy.contains('Japanese Flashcards');
  });
});
