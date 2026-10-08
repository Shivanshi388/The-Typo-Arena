import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../services/api";
import { useGameContext } from "../context/GameContext";

export default function JoinRoom() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setPlayer, setRoom } = useGameContext();

  const handleJoin = async (event) => {
    event.preventDefault();

    if (!name.trim() || !roomCode.trim()) {
      setError("Enter your name and room code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await joinRoom(
        roomCode.trim().toUpperCase(),
        name.trim()
      );

      setPlayer({
        id: data.user._id,
        name: data.user.name,
      });

      setRoom(data.room);

      navigate(`/lobby/${data.room.code}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page form-page">
      <form className="form-card" onSubmit={handleJoin}>
        <p className="eyebrow">JOIN A GAME</p>
        <h1>Join Room</h1>
        <p>Enter the room code shared by your friend.</p>

        <label htmlFor="name">Your name</label>

        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          maxLength={30}
        />

        <label htmlFor="roomCode">Room code</label>

        <input
          id="roomCode"
          value={roomCode}
          onChange={(event) =>
            setRoomCode(event.target.value.toUpperCase())
          }
          placeholder="ABC123"
          maxLength={6}
        />

        {error && <p className="error">{error}</p>}

        <button className="primary-button" disabled={loading}>
          {loading ? "Joining..." : "Join Room"}
        </button>
      </form>
    </main>
  );
}
