import "./aws";
import http from "http";
import { Polly } from "aws-sdk";

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
        let data;
        cb.on("data", (chunkData) => {
          data = chunkData;
        });
        cb.on("end", () => {
          res(data);
        });
      });
    });
  }
  if (data) {
    return synthesizeSpeech(data);
  } else {
    return "";
  }
};
