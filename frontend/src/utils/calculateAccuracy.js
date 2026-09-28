export default function calculateAccuracy(
  typedText,
  targetText
) {
  if (!typedText || !targetText) {
    return 100;
  }

  const length = Math.min(
    typedText.length,
    targetText.length
  );

  let correct = 0;

  for (let i = 0; i < length; i++) {
    if (typedText[i] === targetText[i]) {
      correct++;
    }
  }

  return (
    Math.round((correct / typedText.length) * 10000) / 100
  );
}