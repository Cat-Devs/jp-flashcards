import { createHash } from 'crypto';
import { FlashCardData, UserData } from '../src/types';
import { bumpUserLevel } from './bump-user-level';
import { dynamoDb } from './dynamo-db';
import { pickRandomCards } from './pick-random-card';

export const trainCards = async (
  userEmail: string,
  items: FlashCardData[],
  userLevelBumped?: boolean
): Promise<string[]> => {
  const userHash = createHash('sha256').update(userEmail).digest('hex');
  const initialUserData: UserData = {
    type: 'user',
    current_level: '1',
    id: userHash,
    weak_cards: {},
    learned_cards: [],
  };
  const data = await dynamoDb.get({
    Key: {
      id: userHash,
    },
  });

  const userData: UserData = {
    ...initialUserData,
    current_level: data.Item?.current_level || initialUserData.current_level,
    weak_cards: data.Item?.weak_cards || initialUserData.weak_cards,
    learned_cards: data.Item?.learned_cards || initialUserData.learned_cards,
  };

  const learnedCards = userData.learned_cards;
  const weakCards = Object.keys(userData.weak_cards);
  const randomLearnedCards = pickRandomCards(learnedCards, 2);

  const cardIds = items
    .filter((card: FlashCardData) => Number(userData.current_level) === Number(card.level))
    .filter((card: FlashCardData) => !learnedCards.includes(card.id) && !weakCards.includes(card.id))
    .map((card: FlashCardData) => card.id);

  if (!weakCards.length) {
    if (!cardIds.length && Number(userData.current_level) >= 5) {
      // Max level reach
      return [];
    }

    // Promote user to the next level
    if (!cardIds.length && !userLevelBumped) {
      await bumpUserLevel(userHash);
      return trainCards(userEmail, items, true);
    }
  }

  return [...weakCards, ...cardIds]
    .splice(0, 13)
    .sort(() => Math.random() - 0.5)
    .concat(randomLearnedCards)
    .sort(() => Math.random() - 0.5);
};
