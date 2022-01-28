import "./aws";
import { DynamoDB } from "aws-sdk";
import localDB from "../data/table-data.json";

const isProd = process.env.NODE_ENV !== "production";

const client = new DynamoDB.DocumentClient({
  region: process.env.NEXT_PUBLIC_REGION,
  params: {
    TableName: process.env.NEXT_PUBLIC_TABLE_NAME,
  },
});

export const dynamoDb = {
  get: (params) => {
    if (isProd) {
      const item = localDB.find((itemDb) => itemDb.id === params.Key.id);

      return {
        Item: item,
      };
    }

    return client.get(params).promise();
  },
  scan: (params) => {
    if (isProd) {
      return {
        Items: localDB,
      };
    }

    return client.scan(params).promise();
  },
  update: (params) => client.update(params).promise(),
  delete: (params) => client.delete(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
};
