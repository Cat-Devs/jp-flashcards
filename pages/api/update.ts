import { DynamoDB } from 'aws-sdk';
import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { isDev } from '../../lib/constants';
import { CardResult, UserData } from '../../src/types';
interface InputData {
  cardId: string;
  cardResult: CardResult;
}

const TableName = process.env.NEXT_DYNAMO_TABLE_NAME;

function getClient() {
  if (isDev) {
    return {
      get: () => ({
        promise: () => ({
          Item: {},
        }),
      }),
      put: () => ({
        promise: () => ({}),
      }),
    };
  }

  return new DynamoDB.DocumentClient({
    region: process.env.NEXT_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_DYNAMO_WRITE_KEY,
      secretAccessKey: process.env.NEXT_DYNAMO_WRITE_SECRET,
    },
    params: { TableName },
  });
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cardId, cardResult }: InputData = JSON.parse(req.body || '{}');
  const session = await getSession({ req });
  const client = getClient();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  if (!cardId || !cardResult) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const userHash = createHash('sha256').update(session.user.email).digest('hex');
  const initialUserData: UserData = {
    id: userHash,
    type: 'user',
    current_level: '1',
    learned_cards: [],
    weak_cards: {},
  };

  try {
    const data = await client
      .get({
        TableName,
        Key: {
          id: userHash,
        },
      })
      .promise();

    const userData = { ...initialUserData, ...data.Item };

    const weakCards = userData?.['weak_cards'] || {};
    const isWeakCard = Boolean(weakCards[cardId]);
    const isLearnedCard = Boolean(userData['learned_cards'].find((card) => card === cardId));
    const cardAccuracy = Number(userData['weak_cards']?.[cardId] || 0);
    const currentAccuracyScore = Number(cardResult === 'correct' ? 100 : 0);
    const newAccuracy = Number(cardAccuracy + currentAccuracyScore / 2);

    if (cardResult === 'void') {
      return res.json({});
    }

    if (isLearnedCard && cardResult === 'correct') {
      return res.json({});
    }

    // Remove from learned cards, when user fails to answer
    if (isLearnedCard && cardResult === 'wrong') {
      userData['learned_cards'] = userData['learned_cards'].filter((card) => card !== cardId);
    }

    // Add card to weak cards, if not already
    if (!isWeakCard && cardResult === 'wrong') {
      userData['weak_cards'][cardId] = '0';
    }

    // Update weak card accuracy
    userData['weak_cards'][cardId] = `${newAccuracy}`;

    // Remove card from weak and add it to learned cards when accuracy is higher 95%
    if (newAccuracy >= 95) {
      userData['weak_cards'][cardId] = undefined;
      userData['learned_cards'].push(`${cardId}`);
    }

    await client.put({ TableName, Item: userData }).promise();
  } catch (err) {
    console.error(err);
  }

  res.json({});
};

export default updateUser;
