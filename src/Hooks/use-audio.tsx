import { useEffect, useRef } from "react";

export function useAudio(audioBuffer: string) {
  const audioEl = useRef<HTMLAudioElement>();

  useEffect(() => {
    audioEl.current = new Audio();

    return () => {
      if (audioEl.current.readyState) {
        audioEl.current.pause();
      }
      audioEl.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (audioBuffer) {
      const audioData = Buffer.from(audioBuffer, "hex");
      const blob = new Blob([audioData], { type: "audio/mpeg" });
      const audioSrc = webkitURL.createObjectURL(blob);
      audioEl.current.src = audioSrc;
      audioEl.current.load();
    }
  }, [audioBuffer]);

  const play = () => {
    if (audioEl.current.readyState) {
      audioEl.current.pause();
      audioEl.current.load();
      audioEl.current.play();
    }
  };

  return { play };
}
