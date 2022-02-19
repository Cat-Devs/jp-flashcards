/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    hideCookieBanner(): void;
    clearStorage(): void;
    authenticate(userEmail: string): void;
    dataCy(value: string): Cypress.Chainable<JQuery<HTMLElement>>;
  }
}
