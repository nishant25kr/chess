import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./components/Landing"
import { Game } from "./components/Game"
function App() {


  return (
    <div className="bg-slate-900 h-screen text-white">

      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game/>} />
        </Routes>

      </BrowserRouter>

    </div>

  )
}

export default App
