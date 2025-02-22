import './App.css'
import { useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from './store/authSlice';

function App() {
  
  const dispatch = useDispatch();

  useEffect(() => {
    const channel = new BroadcastChannel('auth_channel'); // Same name as in authSlice.js
    console.log('BroadcastChannel listener initialized');
    let isLogginout=false;

    channel.onmessage = (event) => {
      console.log('Message received:', event.data);
      if (event.data === 'logout' && !isLogginout) {
        console.log('Logout detected via BroadcastChannel');
        isLogginout=true;
        dispatch(logout());
       window.location.reload();
      }
    };

    return () => {
      console.log('Cleaning up BroadcastChannel');
      channel.close();
    };
  }, [dispatch]);

  
  

  return (
    <>
      <Header/>
     
      <Outlet/>
    
      <Footer/>
    </>
  )
}

export default App
