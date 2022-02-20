describe('Settings', () => {
  beforeEach(() => {
    cy.clearStorage();
  });

  describe('Guest user', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should see the card mode settings', () => {
      cy.dataCy('card-mode-settings');
      cy.dataCy('card-mode-settings').contains('Show cards in English');
    });

    it('should see the game level settings', () => {
      cy.dataCy('game-level-settings');
      cy.get('input[name="game-level-buttons-group"]:checked').should('have.value', '1');
    });
  });

  describe('card mode', () => {
    const accordionSummaryEl = '[data-cy="card-mode-settings"]';
    const cardModeSettingsGroup = 'input[name="card-mode-buttons-group"]';

    it('should expand the card mode settings', () => {
      cy.get(accordionSummaryEl).should('have.attr', 'aria-expanded').and('equal', 'false');
      cy.get(accordionSummaryEl).click();
      cy.get(accordionSummaryEl).should('have.attr', 'aria-expanded').and('equal', 'true');
    });

    it('should set a different card mode', () => {
      cy.get(`${cardModeSettingsGroup}:checked`).should('have.value', 'en');
      cy.get(accordionSummaryEl).click();
      cy.get('[data-cy="card-mode-settings-kana"]').click();
      cy.get(`${cardModeSettingsGroup}:checked`).should('have.value', 'kana');
    });
  });

  describe('game level', () => {
    const gameLevelGroup = 'input[name="game-level-buttons-group"]';

    it('should set a different game level', () => {
      cy.get(`${gameLevelGroup}:checked`).should('have.value', '1');
      cy.get('input[name="game-level-buttons-group"][value="2"]').click();
      cy.get(`${gameLevelGroup}:checked`).should('have.value', '2');
    });
  });

  describe('Authenticated user', () => {
    beforeEach(() => {
      cy.authenticate('test@user.com');
      cy.hideCookieBanner();
      cy.visit('/');
    });

    it('should see the game mode settings', () => {
      cy.dataCy('game-mode-settings');
    });
  });
});
