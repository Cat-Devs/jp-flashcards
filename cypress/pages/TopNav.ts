export class TopNav {
  openMenu() {
    cy.get('[data-cy="open-profile-btn"]').click();
  }

  shouldHaveMenu() {
    cy.get('[data-cy="logout-btn"]').should('be.visible');
  }
}
