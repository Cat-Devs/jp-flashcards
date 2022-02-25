import { DynamoDB } from 'aws-sdk';
import './aws';
import { isDev, isProd } from './constants';
const localDB = require(`../data/table-data-local.json`);

const TableName = process.env.NEXT_DYNAMO_TABLE_NAME;

const client =
  isProd &&
  new DynamoDB.DocumentClient({
    region: process.env.NEXT_AWS_REGION,
    params: { TableName },
  });

export const dynamoDb = {
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
  scan: async <T>(params: Omit<DynamoDB.DocumentClient.ScanInput, 'TableName'>): Promise<{ Items: T[] }> => {
    try {
      if (isDev) {
        return {
          Items: localDB,
        };
      }

      const scanItems: unknown = await client.scan({ TableName, ...params }).promise();
      return scanItems as { Items: T[] };
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
      console.warn(err);

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
      console.warn(err);

      console.error(
        'Your AWS credentials are probably wrong or missing inside your environment variables or .env file'
      );
      console.error(err?.message);
      return {};
    }
  },
};
