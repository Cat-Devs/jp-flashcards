import type { CardData, CardMode, FlashCardData, GameLevel, UserData } from '../src/types';
import { getUserData } from './get-user-data';

export const getAllCards = async (
  userHash: string,
  items: FlashCardData[],
  cardMode: CardMode,
  gameLevel: GameLevel
): Promise<CardData[]> => {
  const userData: UserData = await getUserData(userHash);
  const userCards = userData.cards;

  return items
    .filter((card: FlashCardData) => Number(gameLevel) >= Number(card.level))
    .filter((card: FlashCardData) => {
      if (cardMode === 'hiragana') {
        return card.hiragana;
      } else if (cardMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .map(
      (card: FlashCardData): CardData => ({
        id: card.id,
        accuracy: userCards.find((userCard) => userCard.id === card.id)?.accuracy || '0',
      })
    )
    .sort(() => Math.random() - 0.5)
    .splice(0, 15);
};
