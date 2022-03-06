import { UserData } from '../src/types';
import * as getDb from './dynamo-db';
import { getUserData } from './get-user-data';
jest.mock('./dynamo-db');

describe('getUserData', () => {
  it('should return a user data object', async () => {
    const userData: UserData = {
      id: '123',
      type: 'user',
      current_level: '1',
      cards: [],
    };

    jest
      .spyOn(getDb, 'getDbClient')
      .mockImplementation(() => ({ get: () => Promise.resolve({ Item: userData }) } as any));

    const res = await getUserData(userData.id);

    expect(res).toEqual(userData);
  });

  it('should return a default user data when nothing is found on the DB', async () => {
    const userId = 'testUser';
    const userData = undefined;
    const expectedUserData: UserData = {
      id: userId,
      type: 'user',
      current_level: '1',
      cards: [],
    };

    jest
      .spyOn(getDb, 'getDbClient')
      .mockImplementation(() => ({ get: () => Promise.resolve({ Item: userData }) } as any));

    const res = await getUserData(userId);

    expect(res).toEqual(expectedUserData);
  });

  it('should merge the default user data with the one present on the database', async () => {
    const userId = 'testUser';
    const userData: Partial<UserData> = {
      current_level: '2',
    };
    const expectedUserData: UserData = {
      current_level: userData.current_level,
      id: userId,
      type: 'user',
      cards: [],
    };

    jest
      .spyOn(getDb, 'getDbClient')
      .mockImplementation(() => ({ get: () => Promise.resolve({ Item: userData }) } as any));

    const res = await getUserData(userId);

    expect(res).toEqual(expectedUserData);
  });
});
