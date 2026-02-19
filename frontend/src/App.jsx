import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import { Game } from "./components/Game";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;