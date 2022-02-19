describe('Home page', () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.visit('/');
  });

  it('should render the home page', () => {
    cy.contains('Japanese Flashcards');
  });

  it('should render a login button', () => {
    cy.get('[data-cy=login]');
  });

  describe('Cookie consent', () => {
    it('should render a cookie banner', () => {
      cy.get('.CookieConsent').should('be.visible');
    });

    it('should have a button', () => {
      cy.get('.CookieConsent').get('button').contains('I understand');
    });

    it('should hide the banner', () => {
      cy.get('.CookieConsent #rcc-confirm-button').click();
      cy.get('.CookieConsent').should('not.exist');
    });
  });
});
