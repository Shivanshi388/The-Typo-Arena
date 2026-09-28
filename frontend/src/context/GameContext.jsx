import { createContext, useContext, useMemo, useState } from "react";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState("WAITING");
  const [raceText, setRaceText] = useState("");
  const [players, setPlayers] = useState([]);
  const [results, setResults] = useState([]);

  const value = useMemo(
    () => ({
      player,
      setPlayer,

      room,
      setRoom,

      gameState,
      setGameState,

      raceText,
      setRaceText,

      players,
      setPlayers,

      results,
      setResults,
    }),
    [
      player,
      room,
      gameState,
      raceText,
      players,
      results,
    ]
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGameContext must be used inside GameProvider"
    );
  }

  return context;
}