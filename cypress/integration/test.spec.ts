describe('Test', () => {
  it('works', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Japanese Flashcards');
  });
});
