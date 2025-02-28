import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {store} from './store/store.js';
import { Provider } from 'react-redux';
import { createBrowserRouter,Route,RouterProvider,createRoutesFromElements } from 'react-router-dom';
import Home from './pages/Home.jsx'
import MultiStepForm from './pages/StudentAdmissionForm.jsx'
import LoginCard from './pages/login/LoginCard.jsx'
import LoginForm from './pages/login/LoginForm.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TeacherEnroll from './pages/TeacherEnroll.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import FeeSubmissionForm from './pages/FeesSubmission.jsx';


const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='/' 
      element={<Home/>}
      errorElement={<ErrorPage/>}/>
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      >
       
      </Route>
      <Route 
        path="/admin/studentform" 
        element={

            <ProtectedRoute>
              <MultiStepForm />
            </ProtectedRoute>
        } 
      />
      <Route 
      path="/admin/staffForm" 
      element={

          <ProtectedRoute>
            <TeacherEnroll />
          </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/feesSubmission" 
      element={

          <ProtectedRoute>
            <FeeSubmissionForm />
          </ProtectedRoute>
      } 
    />
      <Route path='/login' 
      element={<LoginCard/>}
      errorElement={<ErrorPage/>}/>
      <Route path='login/loginForm' element={<LoginForm/>}/>
      {/* <Route path='/admin' element={<AdminDashboard/>}/> */}
      {/* <Route path='/staff' element={<TeacherEnroll/>}/> */}
      <Route path='*' element={<ErrorPage error={{status:404,statusText:"This Page Doesn't exist"}}/>}/>
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
