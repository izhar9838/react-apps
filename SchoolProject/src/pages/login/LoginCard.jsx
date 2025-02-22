import React from 'react'
import adminCard from '../../assets/icons/admin.png'
import studentCard from '../../assets/icons/profile.png'
import teacherCard from '../../assets/icons/teacher.png'
import './LoginCard.css'
import { useNavigate } from 'react-router-dom'

function LoginCard() {
  const navigate=useNavigate();
  
  return (
   <>
   <div className='min-h-[78vh] w-full flex justify-center items-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] '>
    <div className=' min-h-[70vh]  flex justify-around flex-wrap items-center card-container'>
      <div className='bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-5 card'>
      <button onClick={() => {
    const loginData = { role: 'student' };
    navigate('loginForm', { state: { loginData } });
  }} className=''>
      <img src={studentCard} alt="" className='card_image'/>
      <p className='pt-1 font-medium'>Students Login</p>
      </button>
      </div>
      <div className='bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-5 card'>
      <button onClick={() => {
    // Example data you want to pass
    const loginData = { role: 'teacher' };

    // Navigate to /login/admin and pass the data via state
    navigate('loginForm', { state: { loginData } });
  }}>
      <img src={teacherCard} alt="" className='card_image'/>
      <p className='pt-1 font-medium'>Teachers Login</p>
      </button>
      
      </div>
      <div className='bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-5 card'>
      <button onClick={() => {
    // Example data you want to pass
    const loginData = { role: 'admin' };

    // Navigate to /login/admin and pass the data via state
    navigate('loginForm', { state: { loginData } });
  }}>
      <img src={adminCard} alt="" className='card_image'/>
      <p className='pt-1 font-medium'>Admin Login</p>
      </button>
      </div>
    </div>
   </div>
   </>

  )
}

export default LoginCard
