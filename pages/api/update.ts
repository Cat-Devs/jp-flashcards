import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDbClient } from '../../lib/dynamo-db';
import { getUserData } from '../../lib/get-user-data';
import { UserData } from '../../src/types';

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

  const updatedUserData: UserData = cards.reduce(
    (acc, cardId) => {
      const learnedCards = acc.learned_cards;
      const weakCards = acc.weak_cards;
      const isWeakCard = Boolean(weakCards[cardId]);
      const isLearnedCard = Boolean(learnedCards.find((card) => card === cardId));
      const cardAccuracy = isLearnedCard ? 100 : (isWeakCard && Number(weakCards[cardId])) || 0;
      const cardResult = wrongCards.find((card) => card === cardId) ? 'wrong' : 'correct';
      const currentAccuracyScore = Number(cardResult === 'correct' ? 100 : 0);
      const newAccuracy = Math.floor(Number((cardAccuracy + currentAccuracyScore) / 2));

      if (isLearnedCard && cardResult === 'correct') {
        return acc;
      }

      // Remove from learned cards, when user fails to answer
      if (isLearnedCard && cardResult === 'wrong') {
        acc.learned_cards = learnedCards.filter((card) => card !== cardId);
      }

      // Add card to weak cards, if not already
      if (!isWeakCard && cardResult === 'wrong') {
        weakCards[cardId] = '0';
      }

      // Update weak card accuracy
      weakCards[cardId] = `${newAccuracy}`;

      // Remove card from weak and add it to learned cards when accuracy is higher 95%
      if (newAccuracy >= 95) {
        delete weakCards[cardId];
        learnedCards.push(`${cardId}`);
      }

      return acc;
    },
    {
      ...userData,
      learned_cards: [...userData.learned_cards],
      weak_cards: { ...userData.weak_cards },
    }
  );

  const accessKeyId = process.env.NEXT_DYNAMO_WRITE_KEY;
  const secretAccessKey = process.env.NEXT_DYNAMO_WRITE_SECRET;
  const client = getDbClient(accessKeyId, secretAccessKey);

  await client.put({ Item: updatedUserData });

  res.json({});
};

export default updateUser;
