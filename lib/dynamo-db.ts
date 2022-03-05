import { DynamoDB } from 'aws-sdk';
import { isDev, isProd } from './constants';
const localDB = require('../data/table-data-local.json');

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

  return {
    get: async (
      params: Omit<DynamoDB.DocumentClient.GetItemInput, 'TableName'>
    ): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
      try {
        if (isDev) {
          const item = localDB.find((itemDb) => itemDb.id === params.Key.id);
          return {
            Item: item,
          };
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
          return {
            Items: localDB,
          };
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
          return {};
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
          return {};
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
