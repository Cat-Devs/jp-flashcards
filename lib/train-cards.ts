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
  const userHash = createHash('sha256').update(userEmail).digest('hex') || null;
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

  const userData: UserData = { ...initialUserData, ...data.Item };
  const learnedCards = userData?.learned_cards;
  const randomLearnedCards = pickRandomCards(learnedCards, 2);

  const cardIds = items
    .filter((card: FlashCardData) => Number(userData.current_level) === Number(card.level))
    .filter((card: FlashCardData) => !learnedCards.includes(card.id))
    .map((card: FlashCardData) => card.id);

  if (!cardIds.length && Number(userData.current_level) >= 5) {
    // Max level reach
    return [];
  }

  // Promote user to the next level
  if (!cardIds.length && !userLevelBumped) {
    await bumpUserLevel(userHash);
    return trainCards(userEmail, items, true);
  }

  return cardIds
    .sort(() => Math.random() - 0.5)
    .splice(0, 13)
    .concat(randomLearnedCards)
    .sort(() => Math.random() - 0.5);
};
