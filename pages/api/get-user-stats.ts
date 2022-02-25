import { DynamoDB } from 'aws-sdk';
import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { UserData } from '../../src/types';

const TableName = process.env.NEXT_DYNAMO_TABLE_NAME;
const isDev = Boolean(process.env.DEV);

function getClient(isDev) {
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
      accessKeyId: process.env.NEXT_DYNAMO_READ_KEY,
      secretAccessKey: process.env.NEXT_DYNAMO_READ_SECRET,
    },
    params: { TableName },
  });
}

interface UserStats {
  userHash: string;
  level: number;
  learnedCards: number;
  weakCards: number;
}

const getUserStats = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const client = getClient(isDev);

  if (!session) {
    return res.status(200).json({});
  }

  const userHash = createHash('sha256').update(session.user.email).digest('hex');
  const initialUserStats: UserStats = {
    userHash,
    level: 1,
    learnedCards: 0,
    weakCards: 0,
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

    const userResponse = data.Item as UserData;
    const level = Number(userResponse?.current_level || initialUserStats.level);
    const weakCards = Number(
      userResponse?.weak_cards ? Object.keys(userResponse.weak_cards)?.length : initialUserStats.weakCards
    );
    const learnedCards = Number(userResponse?.learned_cards?.length || initialUserStats.learnedCards) + weakCards;

    const userData: UserStats = {
      userHash,
      level,
      learnedCards,
      weakCards,
    };
    res.json(userData);
  } catch (err) {
    // User not yet created, returning initial stats
    res.json(initialUserStats);
  }
};

export default getUserStats;
