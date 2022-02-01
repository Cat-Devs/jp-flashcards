import { useEffect } from "react";

export function useKeyPress(onArrowRight: any, onArrowLeft: any) {
  function upHandler({ key }: KeyboardEvent) {
    if (key === "ArrowRight") {
      onArrowRight();
    }
    if (key === "ArrowLeft") {
      onArrowLeft();
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
}
