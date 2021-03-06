import { UserStub } from './User';

interface Session {
  user: { name: string; email: string };
  expires: string;
}

export class ApiStub {
  private readonly baseUrl = Cypress.config().baseUrl;
  readonly User: UserStub;

  constructor() {
    this.User = new UserStub(this.baseUrl);
  }

  getAuthSession(config: { hasSession: boolean }): Session {
    const response: Session = {
      user: { name: 'J Smith', email: 'jsmith@example.com' },
      expires: new Date(Date.now() + 60000 * 10).toJSON(),
    };

    cy.intercept('GET', `${this.baseUrl}/api/auth/session`, {
      body: config.hasSession ? response : {},
    }).as('getAuthSession');
    return response;
  }

  play(): { data: string } {
    const response = {
      data: '123',
    };

    cy.intercept('POST', `${this.baseUrl}/api/play`, {
      body: response,
    }).as('playSound');

    return response;
  }
}
