import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import Pilgrimage from './views/Pilgrimage'
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/:id" element={ <Pilgrimage /> } ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
