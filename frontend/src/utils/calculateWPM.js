export default function calculateWPM(text, elapsedSeconds) {
  if (!text || elapsedSeconds <= 0) {
    return 0;
  }

  const words = text.length / 5;
  const minutes = elapsedSeconds / 60;

  return Math.round(words / minutes);
}