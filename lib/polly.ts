import fetch from 'node-fetch';
import { Polly } from 'aws-sdk';
import './aws';

const isDev = Boolean(process.env.DEV);

const synthesizeSpeech = async (text: string): Promise<Polly.AudioStream | undefined> => {
  return new Promise((resolve, reject) => {
    const pollyParams: AWS.Polly.Types.SynthesizeSpeechInput = {
      OutputFormat: 'mp3',
      SampleRate: '24000',
      Text: `<speak><prosody rate="70%">${text}</prosody></speak>`,
      TextType: 'ssml',
      LanguageCode: 'ja-JP',
      VoiceId: 'Takumi',
      Engine: 'neural',
    };

    const polly = new Polly({ region: process.env.NEXT_PUBLIC_REGION });

    return polly.synthesizeSpeech(pollyParams, (error: AWS.AWSError, data: AWS.Polly.Types.SynthesizeSpeechOutput) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(data.AudioStream);
    });
  });
};

function toBuffer(ab: ArrayBuffer) {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}
export const createAudioData = async (data: string, host: string): Promise<Polly.AudioStream | undefined> => {
  if (data && isDev) {
    const sampleAudio = `${host}/test-sound.mp3`;
    const res = await fetch(sampleAudio);
    const resBuffer = await res.arrayBuffer();

    return toBuffer(resBuffer);
  } else if (data) {
    return synthesizeSpeech(data);
  }
  return Promise.resolve('');
};
