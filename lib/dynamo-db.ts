import "./aws";
import { DynamoDB } from "aws-sdk";
const localDB = require(`../data/${process.env.TABLE_NAME || "table-data"}.json`);

const isDev = process.env.NODE_ENV !== "production";

const client = new DynamoDB.DocumentClient({
  region: process.env.NEXT_PUBLIC_REGION,
  params: {
    TableName: process.env.NEXT_PUBLIC_TABLE_NAME,
  },
});

export const dynamoDb = {
  get: (params) => {
    if (isDev) {
      const item = localDB.find((itemDb, index) => `${Number(10000 + index)}` === params.Key.id);

      return {
        Item: item,
      };
    }

    return client.get(params).promise();
  },
  scan: (params) => {
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

    return client.scan(params).promise();
  },
  update: (params) => client.update(params).promise(),
  delete: (params) => client.delete(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
};
