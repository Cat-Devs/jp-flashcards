import { bumpUserLevel } from './bump-user-level';
import * as dbClient from './dynamo-db';

jest.mock('./dynamo-db');

describe('bumpUserLevel', () => {
  const mockDynamo = {
    get: jest.fn(),
    update: jest.fn(),
  };

  it('should throw an error if the database call does not return an Item', async () => {
    const userHash = 'testHash';
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDynamo as any);
    mockDynamo.get.mockResolvedValue(undefined);

    await expect(bumpUserLevel(userHash)).rejects.toThrowError('Cannot get current user level');
  });

  it('should throw an error if the user is not found', async () => {
    const userHash = 'testHash';
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDynamo as any);
    mockDynamo.get.mockResolvedValue({ Item: undefined });

    await expect(bumpUserLevel(userHash)).rejects.toThrowError('Cannot get current user level');
  });

  it('should throw an error if the user data is missing the level', async () => {
    const userHash = 'testHash';
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDynamo as any);
    mockDynamo.get.mockResolvedValue({ Item: {} });

    const res = bumpUserLevel(userHash);

    expect(res).rejects.toThrowError('Cannot get current user level');
  });

  it('should throw an error if the user cannot be updated', async () => {
    const userHash = 'testHash';
    const expectedError = 'test error';
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDynamo as any);
    jest.spyOn(console, 'error').mockReturnThis();
    mockDynamo.get.mockResolvedValue({ Item: { current_level: 1 } });
    mockDynamo.update.mockRejectedValue(expectedError);

    const res = bumpUserLevel(userHash);

    expect(res).rejects.toThrowError(expectedError);
  });

  it('should get the current user', async () => {
    const userHash = 'testHash';
    mockDynamo.get.mockResolvedValue({ Item: { current_level: 1 } });
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDynamo as any);

    await bumpUserLevel(userHash);

    expect(mockDynamo.get).toBeCalledWith({ Key: { id: userHash } });
  });

  it('should bump the user level', async () => {
    const userHash = 'testHash';
    const userLevel = '1';
    const expectedLevel = '2';
    mockDynamo.get.mockResolvedValue({ Item: { current_level: userLevel } });
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDynamo as any);
    const expectedUpdateInput = {
      Key: {
        id: userHash,
      },
      UpdateExpression: 'set #l = :l',
      ExpressionAttributeNames: {
        '#l': 'current_level',
      },
      ExpressionAttributeValues: {
        ':l': `${expectedLevel}`,
      },
    };

    await bumpUserLevel(userHash);

    expect(mockDynamo.update).toBeCalledWith(expectedUpdateInput);
  });
});
