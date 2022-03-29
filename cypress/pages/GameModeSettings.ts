export class GameModeSettings {
  open(): void {
    cy.get('[data-cy="game-mode-settings"]').click();
  }

  shouldBeOpen(): void {
    cy.get('[data-cy="game-mode-option-container"]').should('be.visible');
  }
}
