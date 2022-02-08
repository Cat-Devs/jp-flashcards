import http from "http";
import aws, { Polly } from "aws-sdk";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

aws.config.update({
  region: process.env.NEXT_PUBLIC_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
});

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || "3000";

const synthesizeSpeech = async (text: string): Promise<Polly.AudioStream | undefined> => {
  return new Promise((resolve, reject) => {
    const pollyParams: AWS.Polly.Types.SynthesizeSpeechInput = {
      OutputFormat: "mp3",
      SampleRate: "24000",
      Text: `<speak><prosody rate="70%">${text}</prosody></speak>`,
      TextType: "ssml",
      LanguageCode: "ja-JP",
      VoiceId: "Takumi",
      Engine: "neural",
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

export const createAudioData = async (data: string): Promise<Polly.AudioStream | undefined> => {
  if (data && isDev) {
    const sampleAudio = `http://localhost:${PORT}/test-sound.mp3`;
    return new Promise((res) => {
      http.get(sampleAudio, (cb) => {
        let response;
        cb.on("data", (chunkData) => {
          response = chunkData;
        });
        cb.on("end", () => {
          res(response);
        });
      });
    });
  } else if (data) {
    return synthesizeSpeech(data);
  }
  return "";
};

const sendAudioData = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const { audio } = JSON.parse(req.body || "{}");

  if (session && audio) {
    const audioData = await createAudioData(audio);
    res.setHeader("content-type", "audio/mpeg").send(audioData);
  } else if (session && !audio) {
    res.status(400).send("No data");
  } else {
    res.status(401).send("Unauthorized request");
  }
};

export default sendAudioData;
