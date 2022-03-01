import type { CardMode, FlashCardData, GameLevel } from '../src/types';

export const guestUserCards = (items: FlashCardData[], cardMode: CardMode, gameLevel: GameLevel): string[] => {
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
    .map((card: FlashCardData) => card.id)
    .sort(() => Math.random() - 0.5)
    .splice(0, 15);
};
