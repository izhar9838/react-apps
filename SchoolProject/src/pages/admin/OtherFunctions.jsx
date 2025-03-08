// TeacherDashboard.jsx
import React from 'react';
import './OtherFunctions.css'
import { useNavigate } from 'react-router-dom';
import ClassRoomImg from '../../assets/admin-rel/otherfunction/classroom.png'
import TimeTableImg from '../../assets/admin-rel/otherfunction/timetable.png'
import EventsImg from '../../assets/admin-rel/otherfunction/events.png'

// SVG Icons as Components
const Sections = () => (
  <img 
    src={ClassRoomImg} 
    alt="Upload Marks Icon" 
    className="h-14 w-14" 
  />
);

const CreateTimeTable = () => (
  <img 
    src={TimeTableImg} 
    alt="Blog News" 
    className="h-14 w-14" 
  />
);

const AddEvents = () => (
  <img 
    src={EventsImg} 
    alt="Announcements Icon" 
    className="h-14 w-14" 
  />
);

const OtherFunctions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[80vh] font-sans">
      {/* Navigation */}
      <nav className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center p-6 items-center">
            <h1 className="text-3xl font-medium text-gray-800">Other Functions</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 dashboard-content">
        {/* Cards Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {/* Upload Marks Card */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin" 
            onClick={() => navigate('/teacher_dashboard/upload-marks')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <Sections />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Sections Manage</h3>
              </div>
            </div>
          </div>

          {/* Share Resources Card */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
            onClick={() => navigate('/teacher/resources')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-green-100 mb-4">
                <CreateTimeTable />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Create Time Table</h3>
              </div>
            </div>
          </div>

          {/* Post Announcements Card */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
            onClick={() => navigate('/teacher/announcements')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-yellow-100 mb-4">
                <AddEvents />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Add Events</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherFunctions;