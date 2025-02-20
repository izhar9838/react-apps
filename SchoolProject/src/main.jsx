import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux';
import { createBrowserRouter,Route,RouterProvider,createRoutesFromElements } from 'react-router-dom';
import Home from './pages/Home.jsx'
import MultiStepForm from './pages/StudentAdmissionForm.jsx'
import LoginCard from './pages/login/LoginCard.jsx'
import LoginForm from './pages/login/LoginForm.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='/' element={<Home/>}/>
      <Route path='/studentform' element={<MultiStepForm/>}/>
      <Route path='/login' element={<LoginCard/>}/>
        <Route path='login/loginForm' element={<LoginForm/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
  </StrictMode>,
)
