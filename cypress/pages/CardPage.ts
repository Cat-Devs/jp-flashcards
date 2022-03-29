const idToWord = {
  '102001': 'spider',
};

type CardId = keyof typeof idToWord;

class CardPage {
  open(id: CardId): void {
    cy.visit(`/shuffle/${id}`);
  }

  shouldBeOpen(id: CardId): void {
    cy.contains(`${idToWord[id]}`);
  }

  checkAnswer(): void {
    cy.get('[data-cy="check-answer-btn"]').click();
  }

  shouldSeeDetails(): void {
    cy.get('[data-cy="card-details"]').should('be.visible');
  }
}

export default new CardPage();
