import { useState,useEffect } from 'react'
import './App.css'
import { useDispatch } from 'react-redux';
import {login,logout} from './store/authSlice';
import authService from './appwrite/auth';
import { Header,Footer } from './components';
import conf from './conf/conf'
import { Outlet } from 'react-router-dom';


function App() {
  const [loading, setLoading] = useState(true);
  const dispatch=useDispatch();
  useEffect(() => {
      authService.getAccount()
      .then(userData=>{
        if (userData) {
          dispatch(login({userData}))
        } else {
          dispatch(logout());
        }
        
      })
      .finally(()=>{
        setLoading(false);
      })
      console.log(conf.appwriteDatabaseId);
      

  }, [])

  return !loading ? (
    <div classNameNameName='min-w-screen min min-h-screen bg-gray-600 flex justify-center content-center flex-col flex-wrap'>
      <Header/>
      <main>
        TODO:  <Outlet />
        </main>
      <Footer/>
    </div>
  ):(
    <div></div>
  );
}

export default App
