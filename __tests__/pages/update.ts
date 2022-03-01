import { createHash } from 'crypto';
import { NextApiRequest } from 'next';
import * as nextAuth from 'next-auth/react';
import * as dbClient from '../../lib/dynamo-db';
import * as getUserData from '../../lib/get-user-data';
import updateUser from '../../pages/api/update';
import type { UserData } from '../../src/types';

describe('update', () => {
  const mockDBClient = {
    put: jest.fn(),
  };
  const testRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  it('should return an error when the user is not authenticated', async () => {
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
    const testReq = { body: JSON.stringify({ cardId: '', cardResult: 'wrong' }) } as NextApiRequest;

    await updateUser(testReq, testRes);

    expect(testRes.status).toBeCalledWith(401);
    expect(testRes.json).toBeCalledWith({ error: 'Unauthorized request' });
  });

  it('should return an error when a card ID is not provided', async () => {
    const testUser = { email: 'test' };
    const testReq = { body: JSON.stringify({ cardResult: 'wrong' }) } as NextApiRequest;
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });

    await updateUser(testReq, testRes);

    expect(testRes.status).toBeCalledWith(400);
    expect(testRes.json).toBeCalledWith({ error: 'Missing data' });
  });

  it('should return an error when a card result is not provided', async () => {
    const testUser = { email: 'test' };
    const testReq = { body: JSON.stringify({ cardId: '1' }) } as NextApiRequest;
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });

    await updateUser(testReq, testRes);

    expect(testRes.status).toBeCalledWith(400);
    expect(testRes.json).toBeCalledWith({ error: 'Missing data' });
  });

  it('should return an error when the request body is not provided', async () => {
    const testUser = { email: 'test' };
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });

    const testReq = {} as NextApiRequest;

    await updateUser(testReq, testRes);

    expect(testRes.status).toBeCalledWith(400);
    expect(testRes.json).toBeCalledWith({ error: 'Missing data' });
  });

  it('should do nothing when the card result is neither correct or wrong', async () => {
    const testUser = { email: 'test' };
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });

    const testReq = { body: JSON.stringify({ cardId: '1', cardResult: 'test' }) } as NextApiRequest;

    await updateUser(testReq, testRes);

    expect(testRes.json).toBeCalledWith({});
  });

  it('should do nothing when the card is already learned and the result is correct', async () => {
    const cardId = '1';
    const testUser = { email: 'test' };
    const userData = { learned_cards: [cardId], weak_cards: {} } as UserData;
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);

    const testReq = { body: JSON.stringify({ cardId, cardResult: 'correct' }) } as NextApiRequest;

    await updateUser(testReq, testRes);

    expect(testRes.json).toBeCalledWith({});
    expect(dbClient.getDbClient).not.toBeCalled();
  });

  it('should update the user weak cards', async () => {
    const cardId = '1';
    const testUser = { email: 'test' };
    const userHash = createHash('sha256').update(testUser.email).digest('hex');
    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      learned_cards: [],
      weak_cards: {},
    };

    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    const testReq = { body: JSON.stringify({ cardId, cardResult: 'wrong' }) } as NextApiRequest;
    const expectedResult: UserData = {
      ...userData,
      weak_cards: {
        [cardId]: '0',
      },
    };
    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalledWith({ Item: expectedResult });
  });

  it('should update the weak card accuracy', async () => {
    const cardId = '1';
    const testUser = { email: 'test' };
    const userHash = createHash('sha256').update(testUser.email).digest('hex');
    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      learned_cards: [],
      weak_cards: {
        [cardId]: '75',
      },
    };

    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    const testReq = { body: JSON.stringify({ cardId, cardResult: 'correct' }) } as NextApiRequest;
    const expectedResult: UserData = {
      ...userData,
      weak_cards: {
        [cardId]: '87',
      },
    };
    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalledWith({ Item: expectedResult });
  });

  it('should remove the card from the weak ones and add it to the learned cards', async () => {
    const cardId = '1';
    const testUser = { email: 'test' };
    const userHash = createHash('sha256').update(testUser.email).digest('hex');
    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      learned_cards: [],
      weak_cards: {
        [cardId]: '90',
      },
    };

    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    const testReq = { body: JSON.stringify({ cardId, cardResult: 'correct' }) } as NextApiRequest;
    const expectedResult: UserData = {
      ...userData,
      learned_cards: [cardId],
      weak_cards: {},
    };

    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalledWith({ Item: expectedResult });
  });

  it('should remove the card from the learned ones and add it to the weak cards', async () => {
    const cardId = '1';
    const testUser = { email: 'test' };
    const userHash = createHash('sha256').update(testUser.email).digest('hex');
    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      learned_cards: [cardId],
      weak_cards: {},
    };

    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    const testReq = { body: JSON.stringify({ cardId, cardResult: 'wrong' }) } as NextApiRequest;
    const expectedResult: UserData = {
      ...userData,
      learned_cards: [],
      weak_cards: {
        [cardId]: '0',
      },
    };

    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalledWith({ Item: expectedResult });
  });
});
