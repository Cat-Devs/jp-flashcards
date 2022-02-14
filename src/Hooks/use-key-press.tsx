import { useEffect, useState } from 'react';

interface KeyHandlers {
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onSpace?: () => void;
}

export function useKeyPress(keyHandlers: KeyHandlers = {}) {
  const [keyPressed, setKeyPressed] = useState<string>(null);

  useEffect(() => {
    function downHandler({ code }: KeyboardEvent) {
      if (!keyPressed && code) {
        setKeyPressed(code);
      }
    }

    function upHandler({ code }: KeyboardEvent) {
      if (!keyPressed || keyPressed !== code) {
        return;
      }

      if (code === 'ArrowRight') {
        keyHandlers.onArrowRight && keyHandlers.onArrowRight();
      }
      if (code === 'ArrowLeft') {
        keyHandlers.onArrowLeft && keyHandlers.onArrowLeft();
      }
      if (code === 'Space') {
        keyHandlers.onSpace && keyHandlers.onSpace();
      }

      setKeyPressed(null);
    }

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [keyHandlers, keyPressed]);
}
