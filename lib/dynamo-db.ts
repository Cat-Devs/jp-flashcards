import "./aws";
import { DynamoDB } from "aws-sdk";
const localDB = require(`../data/table-data-local.json`);

const isDev = Boolean(process.env.DEV);

const client =
  !isDev &&
  new DynamoDB.DocumentClient({
    region: process.env.NEXT_PUBLIC_REGION,
    params: {
      TableName: process.env.NEXT_PUBLIC_TABLE_NAME,
    },
  });

export const dynamoDb = {
  get: async (params) => {
    try {
      if (isDev) {
        const item = localDB.find((_itemDb, index) => `${Number(10000 + index)}` === params.Key.id);

        return {
          Item: item,
        };
      }

      const getItem = await client.get(params).promise();
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
  scan: async (params) => {
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

      const scanItems = await client.scan(params).promise();
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
};
