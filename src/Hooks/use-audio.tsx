import { useEffect, useState } from "react";

export function useAudio(audioBuffer: string) {
  const [audioEl, setAudio] = useState<HTMLAudioElement>();

  useEffect(() => {
    if (audioBuffer) {
      const audioData = Buffer.from(audioBuffer, "hex");
      const blob = new Blob([audioData], { type: "audio/mpeg" });
      const audioSrc = webkitURL.createObjectURL(blob);
      setAudio(new Audio(audioSrc));
    }
  }, [audioBuffer]);

  const play = () => {
    if (audioEl.readyState === 4) {
      audioEl.play();
    }
  };

  return { play };
}
