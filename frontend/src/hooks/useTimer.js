import { useEffect, useState } from "react";

export default function useTimer(
  initialSeconds = 30,
  running = false
) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const reset = (newTime = initialSeconds) => {
    setSeconds(newTime);
  };

  return {
    seconds,
    reset,
    finished: seconds === 0,
  };
}