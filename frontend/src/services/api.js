const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const createRoom = (playerName) =>
  request("/rooms", {
    method: "POST",
    body: JSON.stringify({ playerName }),
  });

export const joinRoom = (roomCode, playerName) =>
  request(`/rooms/${roomCode}/join`, {
    method: "POST",
    body: JSON.stringify({ playerName }),
  });

export const getRoom = (roomCode) =>
  request(`/rooms/${roomCode}`);

export const getLeaderboard = () =>
  request("/leaderboard");

export const getUser = (userId) =>
  request(`/users/${userId}`);

export default {
  createRoom,
  joinRoom,
  getRoom,
  getLeaderboard,
  getUser,
};
