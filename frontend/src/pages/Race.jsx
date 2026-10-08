import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTyping from "../hooks/useTyping";
import useGame from "../hooks/useGame";
import { useGameContext } from "../context/GameContext";

export default function Race() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const {
    raceText,
    gameState,
  } = useGameContext();

  const {
    sendProgress,
    finishRace,
  } = useGame(roomCode);

  const {
    typedText,
    handleTyping,
    wpm,
    accuracy,
    progress,
    completed,
  } = useTyping(raceText);

  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (completed) {
      finishRace(wpm, accuracy, progress);
    }
  }, [
    completed,
    wpm,
    accuracy,
    progress,
    finishRace,
  ]);

  useEffect(() => {
    sendProgress(progress, wpm, accuracy);
  }, [progress, wpm, accuracy, sendProgress]);

  useEffect(() => {
    if (gameState === "FINISHED") {
      navigate(`/results/${roomCode}`);
    }
  }, [gameState, navigate, roomCode]);

  const renderText = () => {
    return raceText.split("").map((character, index) => {
      let className = "";

      if (index < typedText.length) {
        className =
          typedText[index] === character
            ? "correct"
            : "incorrect";
      } else if (index === typedText.length) {
        className = "current";
      }

      return (
        <span
          className={className}
          key={`${character}-${index}`}
        >
          {character}
        </span>
      );
    });
  };

  return (
    <main className="page race-page">
      <section className="race-card">
        <div className="race-header">
          <div>
            <span>WPM</span>
            <strong>{wpm}</strong>
          </div>

          <div>
            <span>ACCURACY</span>
            <strong>{accuracy}%</strong>
          </div>

          <div>
            <span>PROGRESS</span>
            <strong>{progress}%</strong>
          </div>
        </div>

        {countdown !== null && (
          <div className="countdown">{countdown}</div>
        )}

        <div className="typing-text">
          {renderText()}
        </div>

        <textarea
          className="typing-input"
          value={typedText}
          onChange={(event) =>
            handleTyping(event.target.value)
          }
          disabled={!raceText || completed}
          placeholder="Start typing here..."
          autoFocus
        />
      </section>
    </main>
  );
}
