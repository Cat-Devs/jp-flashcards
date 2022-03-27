import CardSummaryPage from 'pages/CardSummaryPage';
import { Stub } from 'stub';

describe('Card summary', () => {
  beforeEach(() => {
    cy.hideCookieBanner();
  });

  it('should render summary', () => {
    Stub.Api.User.getStats({ weakCards: 0, learnedCards: 0, level: 1 });
    Stub.Api.getAuthSession({ hasSession: true });

    CardSummaryPage.open();

    cy.wait('@getUserStats');
    cy.wait('@getAuthSession');

    CardSummaryPage.shouldBeOpen();

    cy.percySnapshot();
  });
});
