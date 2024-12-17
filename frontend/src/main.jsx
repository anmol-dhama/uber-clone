import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './contexts/UsserContext.jsx'
import CaptainContext from './contexts/CaptainContext.jsx'
import SocketProvider from './contexts/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainContext>
      <UserContext>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
         </SocketProvider>
      </UserContext>
    </CaptainContext>
  </StrictMode>,
)
