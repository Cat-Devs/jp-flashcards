import aws from "aws-sdk";
const isDev = Boolean(process.env.DEV);

if (!isDev) {
  aws.config.update({
    region: process.env.NEXT_PUBLIC_REGION,
    accessKeyId: process.env.NEXT_PUBLIC_DYNAMO_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
  });
}
