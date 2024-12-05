import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import CaptainSignup from './pages/CaptainSignup'
import Captainlogin from './pages/Captainlogin'
import UserSignup from './pages/UserSignup'
import UserLogin from './pages/UserLogin'
import Start from './pages/Start'
import UsserProtectWrapper from './pages/UserProtextWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'

function App() {

  return (
    <div>
       <Routes>
        <Route path='/' element={<Start/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/signup' element={<UserSignup/>}/>
        <Route path='/captain-login' element={<Captainlogin/>}/>
        <Route path='/captain-signup' element={<CaptainSignup/>}/>
        <Route path='/home' element={
          <UsserProtectWrapper>
            <Home/>
          </UsserProtectWrapper>
          }/>
           <Route path='/logout' element={
          <UsserProtectWrapper>
            <UserLogout/>
          </UsserProtectWrapper>
          }/>
        <Route path='/captain-home' element={
         <CaptainProtectWrapper>
          <CaptainHome/>
          </CaptainProtectWrapper>
        }/>
         <Route path='/captain-logout' element={
        <CaptainProtectWrapper>
          <CaptainLogout/>
        </CaptainProtectWrapper>
        }/>
       </Routes>
    </div>
  )
}

export default App
