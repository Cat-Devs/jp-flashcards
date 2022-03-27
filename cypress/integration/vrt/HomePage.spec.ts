import HomePage from 'pages/HomePage';
import { Stub } from 'stub';

describe('Homepage', () => {
  describe('Guest', () => {
    it('should render', () => {
      cy.hideCookieBanner();
      Stub.Api.getAuthSession({ hasSession: false });

      HomePage.open();

      cy.wait('@getAuthSession');
      HomePage.shouldBeOpen();

      cy.percySnapshot();
    });

    it('should render cookie banner', () => {
      Stub.Api.getAuthSession({ hasSession: false });

      HomePage.open();

      cy.wait('@getAuthSession');
      HomePage.shouldBeOpen();

      cy.percySnapshot();
    });
  });

  describe('User', () => {
    beforeEach(() => {
      cy.hideCookieBanner();
      Stub.Api.getAuthSession({ hasSession: true });
      Stub.Api.User.getStats({ weakCards: 0, learnedCards: 0, level: 1 });

      HomePage.open();

      cy.wait('@getAuthSession');
      cy.wait('@getUserStats');

      HomePage.shouldBeOpen();
    });

    describe('Does not have weak words', () => {
      it('should render homepage', () => {
        cy.percySnapshot();
      });

      it('should render gamemodes', () => {
        HomePage.gameModeSettings.open();
        HomePage.gameModeSettings.shouldBeOpen();

        cy.percySnapshot();
      });
    });

    describe('Has weak words', () => {
      beforeEach(() => {
        Stub.Api.getAuthSession({ hasSession: true });
        Stub.Api.User.getStats({ weakCards: 2, learnedCards: 2, level: 1 });

        HomePage.open();

        cy.wait('@getAuthSession');
        cy.wait('@getUserStats');

        HomePage.shouldBeOpen();
      });

      it('should render homepage', () => {
        cy.percySnapshot();
      });

      it('should render gamemodes', () => {
        HomePage.gameModeSettings.open();
        HomePage.gameModeSettings.shouldBeOpen();

        cy.percySnapshot();
      });
    });
  });
});
