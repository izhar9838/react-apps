// AdminDashboard.jsx
import React from 'react';
import './AdminDashboard.css';
import StuImg from '../../assets/admin-rel/Student.png';
import TeachImg from '../../assets/admin-rel/teacher.png';
import FeesImg from '../../assets/admin-rel/Fees.jpg';
import FunctionImg from '../../assets/admin-rel/additional-fun.png'
import {useNavigate} from 'react-router-dom';

// SVG Icons as Components
const StudentIcon = () => (
  
  <img 
    src={StuImg} // For public folder in Create React App
    // OR src={`${process.env.PUBLIC_URL}/student-icon.png`} for explicit public path
    // OR src={require('../assets/student-icon.png')} for src/assets in some setups
    alt="Student Icon" 
    className="h-12 w-12" 
  />
);


const TeacherIcon = () => (
  <img 
    src={TeachImg} // For public folder in Create React App
    // OR src={`${process.env.PUBLIC_URL}/student-icon.png`} for explicit public path
    // OR src={require('../assets/student-icon.png')} for src/assets in some setups
    alt="Student Icon" 
    className="h-12 w-12" 
  />
);

const FeesIcon = () => (
  <img 
    src={FeesImg} // For public folder in Create React App
    // OR src={`${process.env.PUBLIC_URL}/student-icon.png`} for explicit public path
    // OR src={require('../assets/student-icon.png')} for src/assets in some setups
    alt="Student Icon" 
    className="h-12 w-12" 
  />
);

const FunctionIcon = () => (
  <img 
    src={FunctionImg} // For public folder in Create React App
    // OR src={`${process.env.PUBLIC_URL}/student-icon.png`} for explicit public path
    // OR src={require('../assets/student-icon.png')} for src/assets in some setups
    alt="Student Icon" 
    className="h-12 w-12" 
  />
);

const AdminDashboard = () => {
  const navigate=useNavigate();
  return (
    <div className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[93vh] font-sans">
      {/* Navigation */}
      <nav className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center p-6 items-center">
            <h1 className="text-2xl font-medium text-gray-800">Admin Dashboard</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl   mx-auto px-4 sm:px-6 lg:px-8 py-6 dashboard-content">
        {/* Cards Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full place-content-center">
          {/* Student Enrolled Card */}
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin" onClick={()=>navigate('/admin/studentform')}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <StudentIcon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Student Enrolled</h3>
              </div>
            </div>
          </div>

          {/* Teacher Enrolled Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow card-margin"
            onClick={()=>navigate('/admin/staffForm')}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-green-100 mb-4">
                <TeacherIcon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Teacher Enrolled</h3>
              </div>
            </div>
          </div>

          {/* Fees Submission Card */}
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
          onClick={()=>navigate('/admin/feesSubmission')}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-yellow-100 mb-4">
                <FeesIcon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Fees Submission</h3>
              </div>
            </div>
          </div>

          {/* Other Functions Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow card-margin"
            >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-purple-100 mb-4">
                <FunctionIcon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Other Functions</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;