import { GameModeSettings } from './GameModeSettings';
import { TopNav } from './TopNav';

class HomePage {
  readonly gameModeSettings = new GameModeSettings();
  readonly nav = new TopNav();

  open(): void {
    cy.visit('/');
  }

  shouldBeOpen(): void {
    cy.contains('Japanese Flashcards').should('be.visible');
  }

  shouldHaveCookieBanner(): void {
    cy.get('.CookieConsent').should('be.visible');
  }
}

export default new HomePage();
