import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDbClient } from '../../lib/dynamo-db';
import { getUserData } from '../../lib/get-user-data';
import type { CardData, UserData } from '../../src/types';

export interface InputData {
  cards: string[];
  wrongCards: string[];
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cards, wrongCards }: InputData = JSON.parse(req.body || '{}');
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  if (!wrongCards || !cards?.length) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const userHash = createHash('sha256').update(session.user.email).digest('hex');
  const userData = await getUserData(userHash);
  const learnedCards = userData.cards.filter((card) => Number(card.accuracy) >= 93);
  const weakCards = userData.cards.filter((card) => Number(card.accuracy) < 93);

  const updatedUserCards: CardData[] = cards.reduce((acc, cardId) => {
    const isWeakCard = Boolean(weakCards[cardId]);
    const isLearnedCard = Boolean(learnedCards.find((card) => card.id === cardId));
    const cardAccuracy = isLearnedCard ? 100 : (isWeakCard && Number(weakCards[cardId])) || 0;
    const cardResult = wrongCards.find((card) => card === cardId) ? 'wrong' : 'correct';
    const currentAccuracyScore = Number(cardResult === 'correct' ? 100 : 0);
    const newAccuracy = Math.floor(Number((cardAccuracy + currentAccuracyScore) / 2));

    return [
      ...acc,
      {
        id: cardId,
        accuracy: `${newAccuracy}`,
      },
    ];
  }, []);

  const accessKeyId = process.env.NEXT_DYNAMO_WRITE_KEY;
  const secretAccessKey = process.env.NEXT_DYNAMO_WRITE_SECRET;
  const client = getDbClient(accessKeyId, secretAccessKey);
  const updatedUserData: UserData = {
    ...userData,
    cards: updatedUserCards,
  };

  await client.put({ Item: updatedUserData });

  res.json({});
};

export default updateUser;
