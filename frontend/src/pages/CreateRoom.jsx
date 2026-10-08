import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/api";
import { useGameContext } from "../context/GameContext";

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setPlayer, setRoom } = useGameContext();

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Enter your name first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await createRoom(name.trim());

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
      <form className="form-card" onSubmit={handleCreate}>
        <p className="eyebrow">CREATE A GAME</p>
        <h1>Create Room</h1>
        <p>Choose a name and invite your friends.</p>

        <label htmlFor="name">Your name</label>

        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          maxLength={30}
          autoFocus
        />

        {error && <p className="error">{error}</p>}

        <button className="primary-button" disabled={loading}>
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </main>
  );
}
