import { BrowserRouter, Routes, Route } from 'react-router-dom'

import SignIn from './views/SignIn'
import SignUp from './views/SignUp'
import Home from './views/Home'
import Factory from './views/Factory'
import Shop from './views/Shop'
import Exchange from './views/Exchange'
import NFTs from './views/NFTs'
import Account from './views/Account'
import Project from './views/Project'

import { GuardRoute } from './components'

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <GuardRoute guest redirect="/" /> }>
          <Route path="/signin" element={ <SignIn /> } />
          <Route path="/signup" element={ <SignUp /> } />
        </Route>
        <Route element={ <GuardRoute user redirect="/signin" /> }>
          <Route path="/" element={ <Home /> } />
          <Route path="/factory" element={ <Factory /> } />
          <Route path="/shop" element={ <Shop /> } />
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
