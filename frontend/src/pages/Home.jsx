import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="page home-page">
      <section className="hero">
        <p className="eyebrow">REAL-TIME TYPING ARENA</p>
        <h1>TYPO ARENA</h1>
        <p className="subtitle">
          Race your friends. Type faster. Accuracy wins.
        </p>

        <div className="home-actions">
          <Link className="primary-button" to="/create">
            Create Room
          </Link>

          <Link className="secondary-button" to="/join">
            Join Room
          </Link>
        </div>

        <Link className="leaderboard-link" to="/leaderboard">
          View Leaderboard ?
        </Link>
      </section>
    </main>
  );
}
