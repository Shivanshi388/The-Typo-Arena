import {
  createRoom,
  getRoomByCode,
  addPlayerToRoom,
} from "../services/roomService.js";

export async function createRoomController(req, res) {
  try {
    const { playerName } = req.body;

    const result = await createRoom(playerName);

    res.status(201).json({
      message: "Room created successfully",
      room: result.room,
      user: result.user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function getRoomController(req, res) {
  try {
    const room = await getRoomByCode(req.params.roomCode);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json({
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function joinRoomController(req, res) {
  try {
    const { playerName } = req.body;

    const result = await addPlayerToRoom(
      req.params.roomCode,
      playerName
    );

    res.status(200).json({
      message: "Joined room successfully",
      room: result.room,
      user: result.user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}
