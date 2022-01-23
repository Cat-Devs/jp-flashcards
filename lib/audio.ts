import "./aws";
import { Polly } from "aws-sdk";

const synthesizeSpeech = async (
  text: string
): Promise<Polly.AudioStream | undefined> => {
  return new Promise((resolve, reject) => {
    const pollyParams: AWS.Polly.Types.SynthesizeSpeechInput = {
      OutputFormat: "mp3",
      SampleRate: "22050",
      Text: `<speak><prosody rate="80%">${text}</prosody></speak>`,
      TextType: "ssml",
      LanguageCode: "ja-JP",
      VoiceId: "Mizuki",
      Engine: "standard",
    };

    const polly = new Polly({ region: process.env.NEXT_PUBLIC_REGION });

    polly.synthesizeSpeech(
      pollyParams,
      (error: AWS.AWSError, data: AWS.Polly.Types.SynthesizeSpeechOutput) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(data.AudioStream);
      }
    );
  });
};

export const createAudioData = async (
  data: string
): Promise<Polly.AudioStream | undefined> => {
  if (data) {
    return synthesizeSpeech(data);
  } else {
    return undefined;
  }
};
