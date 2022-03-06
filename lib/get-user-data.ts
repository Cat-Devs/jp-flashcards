import type { UserData } from '../src/types';
import { getDbClient } from './dynamo-db';

export const getUserData = async (userHash: string): Promise<UserData> => {
  const client = getDbClient();
  const initialUserData: UserData = {
    id: userHash,
    type: 'user',
    current_level: '1',
    cards: [],
  };
  const data = await client.get({
    Key: {
      id: userHash,
    },
  });

  return {
    ...initialUserData,
    current_level: data.Item?.current_level || initialUserData.current_level,
    cards: data.Item?.cards || initialUserData.cards,
  };
};
