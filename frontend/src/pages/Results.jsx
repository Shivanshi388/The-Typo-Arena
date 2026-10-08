import { Link, useParams } from "react-router-dom";
import { useGameContext } from "../context/GameContext";

export default function Results() {
  const { roomCode } = useParams();
  const { results } = useGameContext();

  return (
    <main className="page results-page">
      <section className="results-card">
        <p className="eyebrow">RACE COMPLETE</p>
        <h1>Results</h1>

        <div className="results-list">
          {results.length === 0 ? (
            <p>No results available yet.</p>
          ) : (
            results.map((result) => (
              <div
                className="result-row"
                key={result.playerId}
              >
                <strong>#{result.position}</strong>

                <span>{result.name}</span>

                <span>{result.wpm} WPM</span>

                <span>{result.accuracy}%</span>
              </div>
            ))
          )}
        </div>

        <div className="results-actions">
          <Link
            className="primary-button"
            to={`/lobby/${roomCode}`}
          >
            Race Again
          </Link>

          <Link
            className="secondary-button"
            to="/"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
