import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { GuardRoute } from './components'

import Signxx from './views/Signxx'
import Home from './views/Home'
import Factory from './views/Factory'
import Exchange from './views/Exchange'
import NFTs from './views/NFTs'
import Account from './views/Account'
import Project from './views/Project'

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
          <Route path="/factory" element={ <Factory /> } />
          <Route path="/exchange" element={ <Exchange /> } />
          <Route path="/nfts" element={ <NFTs /> } />
          <Route path="/account" element={ <Account /> } />
          <Route path="/:id" element={ <Project /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
