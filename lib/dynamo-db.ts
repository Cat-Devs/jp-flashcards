import "./aws";
import { DynamoDB } from "aws-sdk";
const localDB = require(`../data/table-data-local.json`);

const TableName = process.env.NEXT_PUBLIC_TABLE_NAME;
const isDev = Boolean(process.env.DEV);

const client =
  !isDev &&
  new DynamoDB.DocumentClient({
    region: process.env.NEXT_PUBLIC_REGION,
    params: { TableName },
  });

export const dynamoDb = {
  get: async (
    params: Omit<DynamoDB.DocumentClient.GetItemInput, "TableName">
  ): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
    try {
      if (isDev) {
        const item = localDB.find((_itemDb, index) => `${Number(10000 + index)}` === params.Key.id);

        return {
          Item: item,
        };
      }

      const getItem = await client.get({ TableName, ...params }).promise();
      return getItem;
    } catch (err) {
      console.error(
        "Your AWS credentials are probably wrong or missing inside your environment variables or .env file"
      );
      console.error(err?.message);
      return {
        Item: null,
      };
    }
  },
  scan: async (
    params: Omit<DynamoDB.DocumentClient.ScanInput, "TableName">
  ): Promise<DynamoDB.DocumentClient.ScanOutput> => {
    try {
      if (isDev) {
        return {
          Items: localDB
            .map((itemDb, index) => ({
              id: `${Number(10000 + index)}`,
              ...itemDb,
            }))
            .filter((itemDb) => itemDb.category !== "LAST_ITEM"),
        };
      }

      const scanItems = await client.scan({ TableName, ...params }).promise();
      return scanItems;
    } catch (err) {
      console.error(
        "Your AWS credentials are probably wrong or missing inside your environment variables or .env file"
      );
      console.error(err?.message);
      return {
        Items: [],
      };
    }
  },
  put: async (
    params: Omit<DynamoDB.DocumentClient.PutItemInput, "TableName">
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
        "Your AWS credentials are probably wrong or missing inside your environment variables or .env file"
      );
      console.error(err?.message);
      return {};
    }
  },
};
