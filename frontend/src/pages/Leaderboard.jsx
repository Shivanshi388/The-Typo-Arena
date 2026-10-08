import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeaderboard } from "../services/api";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboard();
        setPlayers(data.leaderboard || []);
      } catch (err) {
        setError(err.message);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <main className="page leaderboard-page">
      <section className="leaderboard-card">
        <p className="eyebrow">GLOBAL RANKINGS</p>
        <h1>Leaderboard</h1>

        {error && <p className="error">{error}</p>}

        <div className="leaderboard-list">
          {players.length === 0 && !error ? (
            <p>No players yet. Be the first!</p>
          ) : (
            players.map((player, index) => (
              <div
                className="leaderboard-row"
                key={player._id}
              >
                <strong>#{index + 1}</strong>

                <span>{player.name}</span>

                <span>{player.bestWpm} WPM</span>

                <span>{player.bestAccuracy}%</span>
              </div>
            ))
          )}
        </div>

        <Link className="secondary-button" to="/">
          Back Home
        </Link>
      </section>
    </main>
  );
}
