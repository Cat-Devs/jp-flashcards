import { createHash } from 'crypto';
import { NextApiRequest } from 'next';
import * as nextAuth from 'next-auth/react';
import * as dbClient from '../../lib/dynamo-db';
import * as getUserData from '../../lib/get-user-data';
import updateUser, { InputData } from '../../pages/api/update';
import type { CardData, UserData } from '../../src/types';

describe('update', () => {
  const testUser = { email: 'test' };
  const userHash = createHash('sha256').update(testUser.email).digest('hex');
  const mockDBClient = {
    put: jest.fn(),
  };

  it('should return an error when the user is not authenticated', async () => {
    const testRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
    const testReq = { body: JSON.stringify({ cardId: '', cardResult: 'wrong' }) } as NextApiRequest;

    await updateUser(testReq, testRes);

    expect(testRes.status).toBeCalledWith(401);
    expect(testRes.json).toBeCalledWith({ error: 'Unauthorized request' });
  });

  it.each([
    undefined,
    {},
    { cards: [] },
    { wrongCards: [] },
    { cards: undefined },
    { wrongCards: undefined },
    { cards: ['1'] },
    { wrongCards: [] },
    { cards: [], wrongCards: [] },
  ])(`should return an error when the required data is not provided: %p`, async (body) => {
    const testRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const testReq = { body: JSON.stringify(body) } as NextApiRequest;
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });

    await updateUser(testReq, testRes);

    expect(testRes.status).toBeCalledWith(400);
    expect(testRes.json).toBeCalledWith({ error: 'Missing data' });
  });

  it('should update the database information', async () => {
    const testRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      cards: [],
    };
    const testData: InputData = {
      cards: ['1'],
      wrongCards: [],
    };
    const testReq = { body: JSON.stringify(testData) } as NextApiRequest;
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);

    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalled();
    expect(testRes.json).toBeCalledWith({});
  });

  it('should add the new weak cards', async () => {
    const testRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      cards: [],
    };
    const testData: InputData = {
      cards: ['1', '2', '3'],
      wrongCards: ['1', '2'],
    };
    const testReq = { body: JSON.stringify(testData) } as NextApiRequest;
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    const expectedCards: CardData[] = [
      { id: '1', accuracy: '0' },
      { id: '2', accuracy: '0' },
      { id: '3', accuracy: '50' },
    ];
    const expectedItem: UserData = {
      ...userData,
      cards: expectedCards,
    };

    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalledWith({ Item: expectedItem });
    expect(testRes.json).toBeCalledWith({});
  });

  it('should add the new learned words', async () => {
    const testRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      cards: [{ id: '1', accuracy: '93' }],
    };
    const testData: InputData = {
      cards: ['1', '2', '3'],
      wrongCards: ['2', '3'],
    };
    const testReq = { body: JSON.stringify(testData) } as NextApiRequest;
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    const expectedItem: UserData = {
      ...userData,
      cards: [
        { id: '1', accuracy: '100' },
        { id: '2', accuracy: '0' },
        { id: '3', accuracy: '0' },
      ],
    };
    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalledWith({ Item: expectedItem });
    expect(testRes.json).toBeCalledWith({});
  });

  it('should preserve the learned words', async () => {
    const testRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      cards: [
        { id: '4', accuracy: '100' },
        { id: '1', accuracy: '93' },
        { id: '8', accuracy: '93' },
      ],
    };
    const testData: InputData = {
      cards: ['1', '2', '3', '4'],
      wrongCards: ['2', '3'],
    };
    const testReq = { body: JSON.stringify(testData) } as NextApiRequest;
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    const expectedItem: UserData = {
      ...userData,
      cards: [
        userData.cards[2],
        { id: '1', accuracy: '100' },
        { id: '2', accuracy: '0' },
        { id: '3', accuracy: '0' },
        { id: '4', accuracy: '100' },
      ],
    };
    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalledWith({ Item: expectedItem });
    expect(testRes.json).toBeCalledWith({});
  });

  it('should remove the card from the learned ones and add it to the weak cards', async () => {
    const testRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userData: UserData = {
      id: userHash,
      type: 'user',
      current_level: '1',
      cards: [{ id: '4', accuracy: '100' }],
    };
    const testData: InputData = {
      cards: ['4'],
      wrongCards: ['4'],
    };
    const testReq = { body: JSON.stringify(testData) } as NextApiRequest;
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    const expectedItem: UserData = {
      ...userData,
      cards: [{ id: '4', accuracy: '50' }],
    };
    await updateUser(testReq, testRes);

    expect(dbClient.getDbClient).toBeCalled();
    expect(getUserData.getUserData).toBeCalledWith(userHash);
    expect(mockDBClient.put).toBeCalledWith({ Item: expectedItem });
    expect(testRes.json).toBeCalledWith({});
  });
});
