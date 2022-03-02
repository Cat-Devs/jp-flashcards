import { DynamoDB } from 'aws-sdk';
import { getDbClient } from './dynamo-db';

const isDev = jest.fn();
const isProd = jest.fn();
jest.mock('./constants', () => ({
  get isDev() {
    return isDev();
  },
  get isProd() {
    return isProd();
  },
}));
jest.mock('../data/table-data-local.json', () => [{ id: '1' }]);

describe('getDbClient', () => {
  it('should initialise a Document Client on production', () => {
    isProd.mockReturnValue(true);
    isDev.mockReturnValue(false);
    jest.spyOn(DynamoDB as any, 'DocumentClient').mockResolvedValue({});

    getDbClient();

    const expectedDocClient = {
      region: process.env.NEXT_AWS_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_DYNAMO_READ_KEY,
        secretAccessKey: process.env.NEXT_DYNAMO_READ_SECRET,
      },
      params: { TableName: process.env.NEXT_DYNAMO_TABLE_NAME },
    };

    expect(DynamoDB.DocumentClient).toBeCalledWith(expectedDocClient);
  });

  it('should not initialise a Document Client when not on production', () => {
    isProd.mockReturnValue(false);
    isDev.mockReturnValue(true);
    jest.spyOn(DynamoDB as any, 'DocumentClient').mockResolvedValue({});

    getDbClient();

    expect(DynamoDB.DocumentClient).not.toBeCalled();
  });

  it('should return some local data when using get on dev', async () => {
    isProd.mockReturnValue(false);
    isDev.mockReturnValue(true);
    jest.spyOn(DynamoDB as any, 'DocumentClient').mockResolvedValue({});

    const client = getDbClient();
    const data = await client.get({
      Key: {
        id: '1',
      },
    });

    expect(data).toEqual({ Item: { id: '1' } });
    expect(DynamoDB.DocumentClient).not.toBeCalled();
  });

  it('should return some database data when using get on dev', async () => {
    isProd.mockReturnValue(true);
    isDev.mockReturnValue(false);
    const testData = { id: '1' };
    jest.spyOn(DynamoDB as any, 'DocumentClient').mockReturnValue({
      get: jest.fn().mockReturnThis(),
      promise: () => ({ Item: testData }),
    });

    const client = getDbClient();
    const data = await client.get({
      Key: {
        id: '1',
      },
    });

    expect(data).toEqual({ Item: testData });
  });
});
