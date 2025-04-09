import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {store} from './store/store.js';
import { Provider } from 'react-redux';
import { createBrowserRouter,Route,RouterProvider,createRoutesFromElements } from 'react-router-dom';
import Home from './pages/Home.jsx'
import StudentAdmissionForm from './pages/admin/StudentAdmissionForm.jsx'
import LoginCard from './pages/login/LoginCard.jsx'
import LoginForm from './pages/login/LoginForm.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import TeacherEnroll from './pages/admin/TeacherEnroll.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import FeeSubmissionForm from './pages/admin/FeesSubmission.jsx';
import ForgotPassword from './pages/login/ForgotPassword.jsx';
import ResetPassword from './pages/login/ResetPassword.jsx';
import TokenProtectedRoute from './components/ResetProtected.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import UploadMarksSelection from './pages/teacher/UploadMark.jsx';
import UploadMarksEntry from './pages/teacher/UploadMarksEntry';
import OtherFunctions from './pages/admin/OtherFunctions.jsx';
import ClassSectionManager from './pages/admin/ClassSectionManager.jsx';
import TeacherProtectedRoute from './pages/teacher/TeacherProtected.jsx';
import EventUploadForm from './pages/admin/EventUploadForm.jsx';
import Timetable from './pages/TimeTable.jsx';
import CreateTimetable from './pages/admin/CreateTimeTable.jsx';


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
      <Route path='/admin/add-section' element={
        <ProtectedRoute>
          <ClassSectionManager/>
        </ProtectedRoute>
      }/>
      <Route path='/time-table' element={<Timetable/>}/>
      <Route 
        path="/admin/studentform" 
        element={

            <ProtectedRoute>
              <StudentAdmissionForm />
            </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/create-time-table" 
        element={

            <ProtectedRoute>
              <CreateTimetable/>
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
    <Route path='/admin/other-Functions' element={
      <ProtectedRoute>
        <OtherFunctions/>
      </ProtectedRoute>}
    />
    <Route path="/admin/other-Functions/add-event" element={
      <ProtectedRoute>
        <EventUploadForm />
      </ProtectedRoute>
      } />

      <Route path='/login' 
      element={<LoginCard/>}
      errorElement={<ErrorPage/>}/>
      <Route path='login/loginForm' element={<LoginForm/>}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token?" element={
          <TokenProtectedRoute>
            <ResetPassword />
          </TokenProtectedRoute>
        } />
      <Route path='/teacher_dashboard' element={
        <TeacherProtectedRoute>
          <TeacherDashboard/>
        </TeacherProtectedRoute>}
      />
      <Route path='/teacher_dashboard/upload-marks' element={
        <TeacherProtectedRoute>
          <UploadMarksSelection/>
        </TeacherProtectedRoute>}
      />

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
