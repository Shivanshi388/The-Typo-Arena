import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Lobby from "./pages/Lobby";
import Race from "./pages/Race";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/lobby/:roomCode" element={<Lobby />} />
        <Route path="/race/:roomCode" element={<Race />} />
        <Route path="/results/:roomCode" element={<Results />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;