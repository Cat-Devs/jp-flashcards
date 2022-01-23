import "./aws";
import { DynamoDB } from "aws-sdk";

const client = new DynamoDB.DocumentClient({
  region: process.env.NEXT_PUBLIC_REGION,
  params: {
    TableName: process.env.NEXT_PUBLIC_TABLE_NAME,
  },
});

export const dynamoDb = {
  get: (params) => client.get(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
  scan: (params) => client.scan(params).promise(),
  update: (params) => client.update(params).promise(),
  delete: (params) => client.delete(params).promise(),
};
