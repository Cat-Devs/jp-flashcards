import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDbClient } from '../../lib/dynamo-db';
import { getAllCards } from '../../lib/get-all-cards';
import { guestUserCards } from '../../lib/guest-user-cards';
import { practiceAllLearnedCards } from '../../lib/practice-all-learned-cards';
import { practiceWeakCards } from '../../lib/practice-weak-cards';
import { trainCards } from '../../lib/train-cards';
import type { CardData, FlashCardData, PrepareGameConfig } from '../../src/types';

const prepareGame = async (req: NextApiRequest, res: NextApiResponse<{ cards: CardData[] } | { error: string }>) => {
  const { config }: { config: PrepareGameConfig } = JSON.parse(req.body || '{}');

  if (!config?.gameMode) {
    return res.json({ error: 'Error! Missing required information' });
  }

  if (config.gameMode !== 'train' && (!config.cardMode || !config.gameLevel)) {
    return res.json({ error: 'Error! Missing required information' });
  }

  const { cardMode, gameLevel, gameMode } = config;
  const session = await getSession({ req });

  if (session && !session?.user?.email) {
    return res.json({ error: 'Cannot find user session' });
  }

  const client = getDbClient();
  const { Items: items } = await client.query<FlashCardData>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: {
      '#type': 'type',
    },
    ExpressionAttributeValues: {
      ':type': 'card',
    },
  });

  if (!items.length) {
    return res.json({ error: 'Error! Missing data' });
  }

  if (!session) {
    const cardData = guestUserCards(items, cardMode, gameLevel);
    return res.json({ cards: cardData });
  }

  const userHash = createHash('sha256').update(session.user.email).digest('hex');

  if (gameMode === 'train') {
    const cardData = await trainCards(userHash, items);
    return res.json({ cards: cardData });
  }

  if (gameMode === 'practice') {
    const cardData = await practiceAllLearnedCards(userHash, items, cardMode);
    return res.json({ cards: cardData });
  }

  if (gameMode === 'weak') {
    const cardData = await practiceWeakCards(userHash, items, cardMode);
    return res.json({ cards: cardData });
  }

  const cardData = await getAllCards(userHash, items, cardMode, gameLevel);
  return res.json({ cards: cardData });
};

export default prepareGame;
