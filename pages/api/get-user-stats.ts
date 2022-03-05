import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDbClient } from '../../lib/dynamo-db';
import type { UserData } from '../../src/types';

interface UserStats {
  userHash: string;
  level: number;
  learnedCards: number;
  weakCards: number;
}

const getUserStats = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(200).json({});
  }
  const client = getDbClient();

  const userHash = createHash('sha256').update(session.user.email).digest('hex');
  const initialUserStats: UserStats = {
    userHash,
    level: 1,
    learnedCards: 0,
    weakCards: 0,
  };

  try {
    const data = await client.get({
      Key: {
        id: userHash,
      },
    });

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
