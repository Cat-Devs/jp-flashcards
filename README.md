This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
test
- [Getting Started](#getting-started)
- [Testing against a production backend](#testing-against-a-production-backend)
- [Environment variables](#environment-variables)
- [Learn More](#learn-more)
- [Deploy with Vercel](#deploy-with-vercel)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This command will run the project in development mode and without using any real resource.

The mock database is present in a JSON format under the `data/table-data.json` folder.
The mock audio file is available under the `public/test-sound.mp3` file.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Testing against a production backend

```bash
npm run prod
# or
yarn prod
```

This will serve your local application using the real back-end services.

Note: It is required to have an AWS account with a DynamoDB table.

Also, make sure to provide your AWS access detail under the .env file.
Read more about this file in the following section.

## Environment variables

If you want to run the project against a real back-backed, you will need to create some resources
under your personal AWS account.

Copy the `env.sample` to `.env` and fill in the missing informations according to your AWS account.
You will need to create a DynamoDB table and put the name under the `NEXT_DYNAMO_TABLE_NAME` variable.
You will also need to create an IAM under your AWS account, give permissions to AWS Polly and read
permissions to your AWS Dynamo table.
Then populate the access key and secret using the following variables under your `.env` file:
`NEXT_DYNAMO_READ_KEY` and `NEXT_DYNAMO_READ_SECRET`.
Finally, make sure the `NEXT_AWS_REGION` variable is correctly set according to your table region.

You should now be able to run the [production script](#testing-against-a-production-backend)
against your AWS account.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy with Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
