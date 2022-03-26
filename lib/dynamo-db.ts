import { DynamoDB } from 'aws-sdk';
import { isDev, isProd } from './constants';
import { LocalDb } from './local-db';

export function getDbClient(
  accessKeyId: string = process.env.NEXT_DYNAMO_READ_KEY,
  secretAccessKey: string = process.env.NEXT_DYNAMO_READ_SECRET
) {
  let client: DynamoDB.DocumentClient;
  const TableName = process.env.NEXT_DYNAMO_TABLE_NAME;

  if (isProd) {
    client = new DynamoDB.DocumentClient({
      region: process.env.NEXT_AWS_REGION,
      credentials: { accessKeyId, secretAccessKey },
      params: { TableName },
    });
  }

  if (isDev) {
    LocalDb.create();
  }

  return {
    get: async (
      params: Omit<DynamoDB.DocumentClient.GetItemInput, 'TableName'>
    ): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
      try {
        if (isDev) {
          const item = LocalDb.get(params);
          return Promise.resolve({
            Item: item,
          });
        }

        const getItem = await client.get({ TableName, ...params }).promise();
        return getItem;
      } catch (err) {
        console.error(
          'Your AWS credentials are probably wrong or missing inside your environment variables or .env file'
        );
        console.error(err?.message);
        return {
          Item: null,
        };
      }
    },
    query: async <T>(params: Omit<DynamoDB.DocumentClient.QueryInput, 'TableName'>): Promise<{ Items: T[] }> => {
      try {
        if (isDev) {
          return Promise.resolve({
            Items: LocalDb.query() as unknown as T[],
          });
        }

        const queryItems: unknown = await client.query({ TableName, ...params }).promise();
        return queryItems as { Items: T[] };
      } catch (err) {
        console.error(
          'Your AWS credentials are probably wrong or missing inside your environment variables or .env file'
        );
        console.error(err?.message);
        return {
          Items: [],
        };
      }
    },
    put: async (
      params: Omit<DynamoDB.DocumentClient.PutItemInput, 'TableName'>
    ): Promise<DynamoDB.DocumentClient.PutItemOutput> => {
      try {
        if (isDev) {
          return Promise.resolve(LocalDb.put(params));
        }

        const putItem = await client.put({ TableName, ...params }).promise();
        return putItem;
      } catch (err) {
        console.error(
          'Your AWS credentials are probably wrong or missing inside your environment variables or .env file'
        );
        console.error(err?.message);
        return {};
      }
    },
    update: async (
      params: Omit<DynamoDB.DocumentClient.UpdateItemInput, 'TableName'>
    ): Promise<DynamoDB.DocumentClient.UpdateItemOutput> => {
      try {
        if (isDev) {
          return Promise.resolve(LocalDb.update(params));
        }

        const updateItem = await client.update({ TableName, ...params }).promise();
        return updateItem;
      } catch (err) {
        console.error(
          'Your AWS credentials are probably wrong or missing inside your environment variables or .env file'
        );
        console.error(err?.message);
        return {};
      }
    },
  };
}
