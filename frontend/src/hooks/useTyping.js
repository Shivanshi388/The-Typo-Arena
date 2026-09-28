import { useCallback, useMemo, useState } from "react";
import calculateWPM from "../utils/calculateWPM";
import calculateAccuracy from "../utils/calculateAccuracy";

export default function useTyping(targetText = "") {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleTyping = useCallback(
    (value) => {
      if (!startTime && value.length > 0) {
        setStartTime(Date.now());
      }

      setTypedText(value);

      if (
        targetText &&
        value.length >= targetText.length &&
        !endTime
      ) {
        setEndTime(Date.now());
      }
    },
    [targetText, startTime, endTime]
  );

  const elapsedSeconds = useMemo(() => {
    if (!startTime) return 0;

    const end = endTime || Date.now();

    return Math.max(0, (end - startTime) / 1000);
  }, [startTime, endTime, typedText]);

  const wpm = useMemo(
    () => calculateWPM(typedText, elapsedSeconds),
    [typedText, elapsedSeconds]
  );

  const accuracy = useMemo(
    () => calculateAccuracy(typedText, targetText),
    [typedText, targetText]
  );

  const progress = targetText
    ? Math.min(
        100,
        Math.round((typedText.length / targetText.length) * 100)
      )
    : 0;

  const reset = () => {
    setTypedText("");
    setStartTime(null);
    setEndTime(null);
  };

  return {
    typedText,
    handleTyping,
    startTime,
    endTime,
    elapsedSeconds,
    wpm,
    accuracy,
    progress,
    completed:
      targetText.length > 0 &&
      typedText.length >= targetText.length,
    reset,
  };
}