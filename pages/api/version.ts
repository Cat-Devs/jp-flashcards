import type { NextApiRequest, NextApiResponse } from 'next';

const getVersion = async (_req: NextApiRequest, res: NextApiResponse) => {
  res.json({ data: process.env.VERCEL_GIT_COMMIT_SHA || 'dev' });
};

export default getVersion;
