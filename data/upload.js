const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  params: {
    TableName: process.env.AWS_USERS_TABLE,
  },
});

const put = (params) => dynamoDb.put(params).promise();

(async () => {
  const tableData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "table-data.json"), "utf8")
  );

  console.log("Creating data...");

  for (const [dataId, data] of tableData.entries()) {
    const cardId = 10000 + Number(dataId);
    const params = {
      Item: {
        id: String(cardId),
        ...data,
      },
    };

    try {
      put(params);
    } catch (error) {
      console.error("failed to put", data.en);
      console.error(error);
      process.exit(1);
    }
  }
})();
