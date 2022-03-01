import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { createAudioData } from '../../lib/polly';

const sendAudioData = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const host = req.headers.origin;
  const { audio } = JSON.parse(req.body || '{}');

  if (session && audio) {
    const audioData = await createAudioData(audio, host);
    const data = audioData.toString('hex');

    res.json({ data });
  } else if (session && !audio) {
    res.status(400).json({ error: 'No data' });
  } else {
    res.status(401).json({ error: 'Unauthorized request' });
  }
};

export default sendAudioData;
