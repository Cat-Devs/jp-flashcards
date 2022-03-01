import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDbClient } from '../../lib/dynamo-db';
import { getAllCards } from '../../lib/get-all-cards';
import { guestUserCards } from '../../lib/guest-user-cards';
import { practiceAllLearnedCards } from '../../lib/practice-all-learned-cards';
import { practiceWeakCards } from '../../lib/practice-weak-cards';
import { trainCards } from '../../lib/train-cards';
import type { FlashCardData, PrepareGameConfig } from '../../src/types';

const prepareGame = async (req: NextApiRequest, res: NextApiResponse) => {
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
  const { Items: items } = await client.scan<FlashCardData>({
    FilterExpression: 'attribute_exists(category)',
  });

  if (!items.length) {
    return res.json({ error: 'Error! Missing data' });
  }

  if (!session) {
    const cardIds = guestUserCards(items, cardMode, gameLevel);
    console.warn('getGuestUserCards', cardIds);

    return res.json({ cardIds });
  }

  const userHash = createHash('sha256').update(session.user.email).digest('hex');

  if (gameMode === 'train') {
    const cardIds = await trainCards(userHash, items);
    console.warn('train cards', cardIds);
    return res.json({ cardIds });
  }

  if (gameMode === 'practice') {
    const cardIds = await practiceAllLearnedCards(userHash, items, cardMode);
    console.warn('practiceCards', cardIds);
    return res.json({ cardIds });
  }

  if (gameMode === 'weak') {
    const cardIds = await practiceWeakCards(userHash, items, cardMode);
    console.warn('practiceWeakCards', cardIds);
    return res.json({ cardIds });
  }

  const cardIds = await getAllCards(userHash, items, cardMode, gameLevel);
  console.warn('getAllCards', cardIds);
  return res.json({ cardIds });
};

export default prepareGame;
