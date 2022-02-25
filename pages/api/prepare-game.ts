import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { dynamoDb } from '../../lib/dynamo-db';
import { trainCards } from '../../lib/train-cards';
import type { CardMode, FlashCardData, GameLevel, GameMode, PrepareGameConfig, UserData } from '../../src/types';

const practiceCards = async (userEmail: string, items: FlashCardData[], cardMode: CardMode): Promise<string[]> => {
  const userHash = createHash('sha256').update(userEmail).digest('hex') || null;
  const initialUserData: UserData = {
    id: userHash,
    type: 'user',
    weak_cards: {},
    learned_cards: [],
    current_level: '1',
  };
  const data = await dynamoDb.get({
    Key: {
      id: userHash,
    },
  });

  const userData: UserData = { ...initialUserData, ...data.Item };
  const weakCardIds = Object.keys(userData?.weak_cards);

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
      const level = userData.current_level;

      return Number(level) >= Number(card.level);
    })
    .filter((card: FlashCardData) => {
      return weakCardIds.includes(card.id) || userData.learned_cards.includes(card.id);
    })
    .map((card: FlashCardData) => card.id)
    .sort(() => Math.random() - 0.5)
    .splice(0, 20);
};

const practiceWeakCards = async (userEmail: string, items: FlashCardData[], cardMode: CardMode): Promise<string[]> => {
  const userHash = createHash('sha256').update(userEmail).digest('hex') || null;
  const initialUserData: UserData = {
    id: userHash,
    type: 'user',
    weak_cards: {},
    learned_cards: [],
    current_level: '1',
  };
  const data = await dynamoDb.get({
    Key: {
      id: userHash,
    },
  });

  const userData: UserData = { ...initialUserData, ...data.Item };
  const weakCardIds = Object.keys(userData?.weak_cards);

  return items
    .filter((card: FlashCardData) => {
      if (cardMode === 'hiragana') {
        return card.hiragana;
      } else if (cardMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .filter((card: FlashCardData) => weakCardIds.includes(card.id))
    .map((card: FlashCardData) => card.id)
    .sort(() => Math.random() - 0.5)
    .splice(0, 20);
};

const getAuthUserCards = async (
  userEmail: string,
  items: FlashCardData[],
  cardMode: CardMode,
  gameLevel: GameLevel,
  gameMode: GameMode
): Promise<string[]> => {
  const userHash = createHash('sha256').update(userEmail).digest('hex') || null;
  const initialUserData: UserData = {
    id: userHash,
    type: 'user',
    weak_cards: {},
    learned_cards: [],
    current_level: '1',
  };
  const data = await dynamoDb.get({
    Key: {
      id: userHash,
    },
  });

  const userData: UserData = { ...initialUserData, ...data.Item };
  const weakCardIds = gameMode === 'practice' ? Object.keys(userData?.weak_cards) : [];

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
      if (gameMode === 'learn') {
        return !userData.learned_cards.includes(card.id) && Number(gameLevel) >= Number(card.level);
      }

      const level = gameMode === 'practice' ? userData.current_level : gameLevel;

      return Number(level) >= Number(card.level);
    })
    .map((card: FlashCardData) => card.id)
    .concat(weakCardIds)
    .sort(() => Math.random() - 0.5)
    .splice(0, 20);
};

const getGuestUserCards = (items: FlashCardData[], cardMode: CardMode, gameLevel: GameLevel): string[] => {
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
    .splice(0, 20);
};

const prepareGame = async (req: NextApiRequest, res: NextApiResponse) => {
  const { config }: { config: PrepareGameConfig } = JSON.parse(req?.body || '{}');

  if (!config?.gameMode) {
    return res.json({ error: 'Error! Missing required information' });
  }

  if (config.gameMode !== 'learn' && (!config?.cardMode || !config?.gameLevel)) {
    return res.json({ error: 'Error! Missing required information' });
  }

  const { cardMode, gameLevel, gameMode } = config;

  const { Items: items } = await dynamoDb.scan<FlashCardData>({
    FilterExpression: 'attribute_exists(category)',
  });

  if (!items?.length) {
    return res.json({ error: 'Error! Missing data' });
  }

  const session = await getSession({ req });

  if (!session) {
    const cardIds = getGuestUserCards(items, cardMode, gameLevel);
    console.warn('getGuestUserCards', cardIds);

    return res.json({ cardIds });
  }

  if (!session.user?.email) {
    return res.json({ error: 'Cannot find user session' });
  }

  if (gameMode === 'learn') {
    const cardIds = await trainCards(session.user?.email, items);
    console.warn('learn new words', cardIds);
    return res.json({ cardIds });
  }

  if (gameMode === 'practice') {
    const cardIds = await practiceCards(session.user?.email, items, cardMode);
    console.warn('practiceCards', cardIds);
    return res.json({ cardIds });
  }

  if (gameMode === 'weak') {
    const cardIds = await practiceWeakCards(session.user?.email, items, cardMode);
    console.warn('practiceWeakCards', cardIds);
    return res.json({ cardIds });
  }

  const cardIds = await getAuthUserCards(session.user?.email, items, cardMode, gameLevel, gameMode);
  console.warn('getAuthUserCards', cardIds);
  return res.json({ cardIds });
};

export default prepareGame;
