import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import { Game } from "./components/Game";
import { Login } from "./screens/login";
import { Signup } from "./screens/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;