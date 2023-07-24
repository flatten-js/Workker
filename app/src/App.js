import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { GuardRoute } from './components'

import Home from './views/Home'
import Project from './views/Project'
import Signxx from './views/Signxx'
import Account from './views/Account'

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <GuardRoute guest redirect="/" /> }>
          <Route path="/signin" element={ <Signxx type="in" /> } />
          <Route path="/signup" element={ <Signxx type="up" /> } />
        </Route>
        <Route element={ <GuardRoute user redirect="/signin" /> }>
          <Route path="/" element={ <Home /> } />
          <Route path="/:id" element={ <Project /> } />
          <Route path="/account" element={ <Account /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
