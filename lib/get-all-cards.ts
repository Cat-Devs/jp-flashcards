import { CardMode, FlashCardData, GameLevel } from '../src/types';
import { getUserData } from './get-user-data';

export const getAllCards = async (
  userHash: string,
  items: FlashCardData[],
  cardMode: CardMode,
  gameLevel: GameLevel
): Promise<string[]> => {
  const userData = await getUserData(userHash);
  const weakCards = Object.keys(userData.weak_cards);
  const learnedCards = userData.learned_cards;

  return items
    .filter((card: FlashCardData) => {
      if (cardMode === 'hiragana') {
        return card.hiragana;
      } else if (cardMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .filter((card: FlashCardData) => !learnedCards.includes(card.id) && Number(gameLevel) >= Number(card.level))
    .map((card: FlashCardData) => card.id)
    .concat(weakCards)
    .sort(() => Math.random() - 0.5)
    .splice(0, 15);
};
