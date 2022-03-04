import type { NextApiRequest, NextApiResponse } from 'next';
const { VERCEL_GIT_COMMIT_SHA } = process.env;

const getVersion = async (_req: NextApiRequest, res: NextApiResponse) => {
  const version = VERCEL_GIT_COMMIT_SHA && VERCEL_GIT_COMMIT_SHA.split('').splice(0, 7).join('');
  res.json({ data: version || 'dev' });
};

export default getVersion;
