Cypress.Commands.add('clearStorage', () => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

Cypress.Commands.add('hideCookieBanner', () => {
  cy.setCookie('cookie-consent', 'true');
});

Cypress.Commands.add('authenticate', (userEmail: string = 'test@mail.com') => {
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 201,
    body: {
      user: { email: userEmail },
    },
  });
});

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});
