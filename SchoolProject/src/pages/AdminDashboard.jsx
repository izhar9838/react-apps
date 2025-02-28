import React from 'react';
import Student from '../assets/admin-rel/Student.png';
import Teacher from '../assets/admin-rel/teacher.png';
import Fees from '../assets/admin-rel/Fees.jpg';
import Additonal from '../assets/admin-rel/additional-fun.png';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate=useNavigate();
  // Sample data for the cards (you can replace images with actual URLs or local assets)
  const cardData = [
    {
      title: 'Student Enroll',
      imgSrc: Student,
    },
    {
      title: 'Staff Enroll',
      imgSrc: Teacher
    },
    {
      title: 'Fee Submission',
      imgSrc: Fees
    },
    {
      title: 'Additional Functions',
      imgSrc: Additonal
    },
  ];

  return (
    <div className='bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] '>
      <div
      style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight:'92vh',
        display:'flex',
        flexDirection:'column',
        alignItems:"center",
        justifyContent:'center',
        width:'100%',
        // border:"2px solid"
      }}
    >
      <h1  className='text-center mb-4 mt-4 text-3xl font-semibold'>
        Admin Dashboard
      </h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
        }}
      >
        {cardData.map((card, index) => (
          <div
            key={index}
            onClick={(e)=>{
              e.preventDefault();
              if(card.title ==='Student Enroll'){
                console.log('Navigating to /admin/studentform');
                navigate('/admin/studentform')
              }
              else if(card.title==='Staff Enroll'){
                console.log('Navigating to admin/staffForm');
                navigate('/admin/staffForm');
                
              }
              else if(card.title==='Fee Submission'){
                console.log('Navigating to admin/fessSubmission');
                navigate('/admin/feesSubmission'); 
              }
            }}
            style={{
                // border:'4px dotted yellow',
              margin:'20px',
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '250px',
              textAlign: 'center',
              padding: '20px',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              // Responsive adjustments
              '@media (maxWidth: 768px)': {
                maxWidth: '45%',
              },
              '@media (maxWidth: 480px)': {
                maxWidth: '100%',
              },
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'scale(1.05)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'scale(1)')
            }
          >
            <img
              src={card.imgSrc}
              alt={card.title}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'contain',
                borderRadius: '8px',
                marginBottom: '15px',

              }}
            />
            <h3
              style={{
                fontSize: '18px',
                color: '#333',
                margin: '0',
              }}
            >
              {card.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;