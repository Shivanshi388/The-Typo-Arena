import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGame from "../hooks/useGame";
import { useGameContext } from "../context/GameContext";

export default function Lobby() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const {
    player,
    players,
    gameState,
    setPlayers,
    setGameState,
    setRaceText,
  } = useGameContext();

  const { markReady, startRace } = useGame(roomCode);

  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (gameState === "RACING") {
      navigate(`/race/${roomCode}`);
    }
  }, [gameState, navigate, roomCode]);

  useEffect(() => {
    return () => {
      setPlayers([]);
      setGameState("WAITING");
      setRaceText("");
    };
  }, [setPlayers, setGameState, setRaceText]);

  const handleReady = () => {
    setReady(true);
    markReady();
  };

  const handleStart = () => {
    startRace();
  };

  return (
    <main className="page lobby-page">
      <section className="lobby-card">
        <p className="eyebrow">WAITING LOBBY</p>

        <div className="room-code">
          <span>ROOM CODE</span>
          <strong>{roomCode}</strong>
        </div>

        <p className="lobby-hint">
          Share this code with the players you want to race.
        </p>

        <div className="players-section">
          <h2>Players ({players.length})</h2>

          <div className="player-list">
            {players.map((item) => (
              <div
                className="player-row"
                key={item.userId}
              >
                <span>{item.name}</span>

                <span className={item.ready ? "ready" : ""}>
                  {item.ready ? "READY" : "WAITING"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lobby-actions">
          {!ready && (
            <button
              className="primary-button"
              onClick={handleReady}
            >
              I'm Ready
            </button>
          )}

          {ready && (
            <button
              className="primary-button"
              onClick={handleStart}
            >
              Start Race
            </button>
          )}
        </div>

        {countdown !== null && (
          <div>{countdown}</div>
        )}

        {!player && (
          <p className="error">
            Player information is missing. Please return to the home page.
          </p>
        )}
      </section>
    </main>
  );
}
