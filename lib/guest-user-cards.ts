import type { CardData, CardMode, FlashCardData, GameLevel } from '../src/types';

export const guestUserCards = (items: FlashCardData[], cardMode: CardMode, gameLevel: GameLevel): CardData[] => {
  return items
    .filter((card: FlashCardData) => {
      if (cardMode === 'hiragana') {
        return card.hiragana;
      } else if (cardMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .filter((card: FlashCardData) => {
      const selectedLevel = Number(gameLevel);
      const cardLevel = Number(card.level);

      return selectedLevel >= cardLevel;
    })
    .map(
      (card: FlashCardData): CardData => ({
        id: card.id,
      })
    )
    .sort(() => Math.random() - 0.5)
    .splice(0, 15);
};
