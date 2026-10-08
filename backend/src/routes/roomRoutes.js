import express from "express";

import {
  createRoomController,
  getRoomController,
  joinRoomController,
} from "../controllers/roomController.js";

const router = express.Router();

router.post("/", createRoomController);
router.get("/:roomCode", getRoomController);
router.post("/:roomCode/join", joinRoomController);

export default router;
