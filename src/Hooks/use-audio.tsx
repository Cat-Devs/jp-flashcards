import { useEffect, useState } from "react";

// This has been deprecated for now as the logic moved inside the Flashcard
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
    audioEl.play();
  };

  return { play };
}
