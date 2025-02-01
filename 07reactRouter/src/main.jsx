import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Contactus from './components/Contactus'
import Aboutus from './components/Aboutus'
import User from './components/User'
import Github, { loaderGithub } from './components/Github.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="contact" element={<Contactus />} />
      <Route path="about" element={<Aboutus />} />
      <Route path="user/:userid" element={<User />} />
      <Route 
        path="github" 
        element={<Github />} 
        loader={loaderGithub} />
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
