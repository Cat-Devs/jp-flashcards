interface UserStats {
  userHash: string;
  level: number;
  learnedCards: number;
  weakCards: number;
}

export class UserStub {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getStats(config: Omit<UserStats, 'userHash'>): UserStats {
    const userHash = '6e3913852f512d76acff15d1e402c7502a5bbe6101745a7120a2a4833ebd2350';
    const response: UserStats = { ...config, userHash: userHash };

    cy.intercept('POST', `${this.baseUrl}/api/get-user-stats`, {
      body: response,
    }).as('getUserStats');
    return response;
  }
}
