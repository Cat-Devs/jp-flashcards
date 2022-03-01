Cypress.Commands.add('hideCookieBanner', () => {
  cy.setCookie('cookie-consent', 'true');
});

Cypress.Commands.add('authenticate', (userEmail: string = 'test@mail.com') => {
  cy.intercept(
    '/api/auth/session',
    { times: 1 },
    {
      statusCode: 200,
      body: {
        user: { email: userEmail },
      },
    }
  );
});

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});
