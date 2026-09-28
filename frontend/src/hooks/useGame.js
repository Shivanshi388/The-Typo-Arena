import { useEffect } from "react";
import useSocket from "./useSocket";
import { useGameContext } from "../context/GameContext";

export default function useGame(roomCode) {
  const {
    player,
    setPlayers,
    setGameState,
    setRaceText,
    setResults,
  } = useGameContext();

  const { socket, emit } = useSocket();

  useEffect(() => {
    if (!roomCode) return;

    emit("JOIN_ROOM", {
      roomCode,
      player,
    });

    const handlePlayerJoined = (data) => {
      setPlayers(data.players || []);
    };

    const handlePlayerLeft = (data) => {
      setPlayers(data.players || []);
    };

    const handleRaceStart = (data) => {
      setGameState("RACING");

      if (data.text) {
        setRaceText(data.text);
      }
    };

    const handleRaceFinished = (data) => {
      setGameState("FINISHED");
      setResults(data.results || []);
    };

    const handleGameState = (data) => {
      if (data.state) {
        setGameState(data.state);
      }

      if (data.players) {
        setPlayers(data.players);
      }

      if (data.text) {
        setRaceText(data.text);
      }
    };

    socket.on("PLAYER_JOINED", handlePlayerJoined);
    socket.on("PLAYER_LEFT", handlePlayerLeft);
    socket.on("RACE_START", handleRaceStart);
    socket.on("RACE_FINISHED", handleRaceFinished);
    socket.on("GAME_STATE", handleGameState);

    return () => {
      socket.off("PLAYER_JOINED", handlePlayerJoined);
      socket.off("PLAYER_LEFT", handlePlayerLeft);
      socket.off("RACE_START", handleRaceStart);
      socket.off("RACE_FINISHED", handleRaceFinished);
      socket.off("GAME_STATE", handleGameState);
    };
  }, [
    roomCode,
    player,
    socket,
    emit,
    setPlayers,
    setGameState,
    setRaceText,
    setResults,
  ]);

  const sendProgress = (progress, wpm, accuracy) => {
    emit("PLAYER_PROGRESS", {
      roomCode,
      playerId: player?.id,
      progress,
      wpm,
      accuracy,
    });
  };

  const markReady = () => {
    emit("PLAYER_READY", {
      roomCode,
      playerId: player?.id,
    });
  };

  const startRace = () => {
    emit("START_RACE", {
      roomCode,
    });
  };

  const finishRace = (wpm, accuracy, progress) => {
    emit("PLAYER_FINISHED", {
      roomCode,
      playerId: player?.id,
      wpm,
      accuracy,
      progress,
    });
  };

  return {
    sendProgress,
    markReady,
    startRace,
    finishRace,
  };
}