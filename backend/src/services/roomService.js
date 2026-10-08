import Room from "../models/Room.js";
import User from "../models/User.js";
import generateRoomCode from "../utils/generateRoomCode.js";

export async function createRoom(playerName) {
  if (!playerName || !playerName.trim()) {
    throw new Error("Player name is required");
  }

  const user = await User.create({
    name: playerName.trim(),
  });

  let code;
  let exists = true;

  while (exists) {
    code = generateRoomCode();
    exists = await Room.exists({ code });
  }

  const room = await Room.create({
    code,
    host: user._id,
    players: [
      {
        userId: user._id,
        name: user.name,
        ready: false,
      },
    ],
  });

  return {
    room,
    user,
  };
}

export async function getRoomByCode(code) {
  return Room.findOne({
    code: code.toUpperCase(),
  }).populate("host");
}

export async function addPlayerToRoom(code, playerName) {
  const room = await getRoomByCode(code);

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.state !== "WAITING") {
    throw new Error("Race has already started");
  }

  if (room.players.length >= room.maxPlayers) {
    throw new Error("Room is full");
  }

  const user = await User.create({
    name: playerName.trim(),
  });

  room.players.push({
    userId: user._id,
    name: user.name,
  });

  await room.save();

  return {
    room,
    user,
  };
}
