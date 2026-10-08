import Room from "../models/Room.js";
import Game from "../models/Game.js";
import User from "../models/User.js";

const activeRaces = new Map();

function getRandomText() {
  const texts = [
    "The best way to improve your typing speed is to practice consistently every day.",
    "Technology becomes powerful when it is designed to solve real problems for real people.",
    "Fast typing is not only about speed. Accuracy and consistency are equally important.",
    "Every challenge is an opportunity to learn something new and become better than yesterday.",
    "Great software is built through patience, experimentation, testing, and continuous improvement."
  ];

  return texts[Math.floor(Math.random() * texts.length)];
}

export function setupSocketManager(io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("JOIN_ROOM", async ({ roomCode, player }) => {
      try {
        if (!roomCode || !player?.id) {
          socket.emit("ERROR", {
            message: "Room code and player are required",
          });
          return;
        }

        const room = await Room.findOne({
          code: roomCode.toUpperCase(),
        });

        if (!room) {
          socket.emit("ERROR", {
            message: "Room not found",
          });
          return;
        }

        socket.join(room.code);

        socket.data.roomCode = room.code;
        socket.data.playerId = player.id;

        io.to(room.code).emit("GAME_STATE", {
          state: room.state,
          players: room.players,
          text: room.text,
        });

        socket.to(room.code).emit("PLAYER_JOINED", {
          players: room.players,
        });
      } catch (error) {
        socket.emit("ERROR", {
          message: error.message,
        });
      }
    });

    socket.on("PLAYER_READY", async ({ roomCode, playerId }) => {
      try {
        const room = await Room.findOne({
          code: roomCode.toUpperCase(),
        });

        if (!room) return;

        const player = room.players.find(
          (item) => item.userId.toString() === playerId
        );

        if (!player) return;

        player.ready = true;
        await room.save();

        io.to(room.code).emit("GAME_STATE", {
          state: room.state,
          players: room.players,
          text: room.text,
        });

        const allReady =
          room.players.length >= 2 &&
          room.players.every((item) => item.ready);

        if (allReady) {
          io.to(room.code).emit("ALL_PLAYERS_READY");
        }
      } catch (error) {
        console.error("PLAYER_READY error:", error.message);
      }
    });

    socket.on("START_RACE", async ({ roomCode }) => {
      try {
        const room = await Room.findOne({
          code: roomCode.toUpperCase(),
        });

        if (!room) return;

        if (room.players.length < 1) return;

        const text = getRandomText();

        room.state = "COUNTDOWN";
        room.text = text;

        await room.save();

        io.to(room.code).emit("GAME_STATE", {
          state: "COUNTDOWN",
          players: room.players,
          text,
        });

        let countdown = 3;

        const countdownInterval = setInterval(async () => {
          io.to(room.code).emit("COUNTDOWN", {
            seconds: countdown,
          });

          countdown--;

          if (countdown < 0) {
            clearInterval(countdownInterval);

            room.state = "RACING";
            await room.save();

            activeRaces.set(room.code, {
              text,
              startedAt: Date.now(),
            });

            io.to(room.code).emit("RACE_START", {
              text,
              startedAt: Date.now(),
            });
          }
        }, 1000);
      } catch (error) {
        console.error("START_RACE error:", error.message);
      }
    });

    socket.on(
      "PLAYER_PROGRESS",
      async ({ roomCode, playerId, progress, wpm, accuracy }) => {
        try {
          const room = await Room.findOne({
            code: roomCode.toUpperCase(),
          });

          if (!room) return;

          const player = room.players.find(
            (item) => item.userId.toString() === playerId
          );

          if (!player) return;

          player.progress = Math.min(100, Math.max(0, progress));
          player.wpm = Math.max(0, wpm || 0);
          player.accuracy = Math.max(
            0,
            Math.min(100, accuracy || 0)
          );

          await room.save();

          io.to(room.code).emit("PLAYER_PROGRESS", {
            playerId,
            progress: player.progress,
            wpm: player.wpm,
            accuracy: player.accuracy,
          });
        } catch (error) {
          console.error(
            "PLAYER_PROGRESS error:",
            error.message
          );
        }
      }
    );

    socket.on(
      "PLAYER_FINISHED",
      async ({ roomCode, playerId, wpm, accuracy, progress }) => {
        try {
          const room = await Room.findOne({
            code: roomCode.toUpperCase(),
          });

          if (!room) return;

          const player = room.players.find(
            (item) => item.userId.toString() === playerId
          );

          if (!player) return;

          player.progress = 100;
          player.wpm = Math.max(0, wpm || 0);
          player.accuracy = Math.max(
            0,
            Math.min(100, accuracy || 0)
          );
          player.finished = true;

          await room.save();

          io.to(room.code).emit("PLAYER_FINISHED", {
            playerId,
            wpm: player.wpm,
            accuracy: player.accuracy,
          });

          const finishedPlayers = room.players.filter(
            (item) => item.finished
          );

          if (finishedPlayers.length >= room.players.length) {
            await finishRace(io, room);
          }
        } catch (error) {
          console.error(
            "PLAYER_FINISHED error:",
            error.message
          );
        }
      }
    );

    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);

      const roomCode = socket.data.roomCode;
      const playerId = socket.data.playerId;

      if (!roomCode || !playerId) return;

      try {
        const room = await Room.findOne({
          code: roomCode,
        });

        if (!room) return;

        room.players = room.players.filter(
          (player) => player.userId.toString() !== playerId
        );

        await room.save();

        io.to(room.code).emit("PLAYER_LEFT", {
          players: room.players,
        });

        if (room.players.length === 0) {
          activeRaces.delete(room.code);
        }
      } catch (error) {
        console.error(
          "Disconnect cleanup error:",
          error.message
        );
      }
    });
  });
}

async function finishRace(io, room) {
  room.state = "FINISHED";

  const sortedPlayers = [...room.players].sort(
    (a, b) => b.wpm - a.wpm
  );

  const results = sortedPlayers.map((player, index) => ({
    playerId: player.userId,
    name: player.name,
    wpm: player.wpm,
    accuracy: player.accuracy,
    position: index + 1,
  }));

  const winner = sortedPlayers[0];

  if (winner) {
    room.players = room.players.map((player) => ({
      ...player.toObject(),
      position:
        sortedPlayers.findIndex(
          (item) =>
            item.userId.toString() === player.userId.toString()
        ) + 1,
    }));
  }

  await room.save();

  for (const result of results) {
    await User.findByIdAndUpdate(result.playerId, {
      $inc: {
        gamesPlayed: 1,
        ...(result.position === 1
          ? { gamesWon: 1 }
          : {}),
      },
      $max: {
        bestWpm: result.wpm,
        bestAccuracy: result.accuracy,
      },
    });
  }

  await Game.create({
    roomCode: room.code,
    players: results,
    text: room.text,
    winner: winner?.userId || null,
  });

  activeRaces.delete(room.code);

  io.to(room.code).emit("RACE_FINISHED", {
    results,
  });
}
