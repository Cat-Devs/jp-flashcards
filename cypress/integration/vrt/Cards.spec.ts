import CardPage from 'pages/CardPage';
import { Stub } from 'stub';

describe('Cards', () => {
  beforeEach(() => {
    cy.hideCookieBanner();
    Stub.Api.getAuthSession({ hasSession: true });
    Stub.Api.User.getStats({ weakCards: 0, learnedCards: 0, level: 1 });
    Stub.Api.play();

    CardPage.open('102001');

    cy.wait('@getAuthSession');
    cy.wait('@getUserStats');
    cy.wait('@playSound');

    CardPage.shouldBeOpen('102001');
  });

  it('should render card', () => {
    cy.percySnapshot();
  });

  it('should render expanded card', () => {
    CardPage.checkAnswer();
    CardPage.shouldSeeDetails();

    cy.percySnapshot();
  });
});
