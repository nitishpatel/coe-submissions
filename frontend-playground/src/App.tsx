import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home';
import Hero from "./pages/Hero";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/counter' element={<Home/>}/>
        <Route path='/' element={<Hero/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App