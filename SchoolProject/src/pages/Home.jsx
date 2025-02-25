import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Home() {
  const navigate=useNavigate();
  let userRole=useSelector(state=>state.auth?.user?.role);
  console.log("User Role is from home.jsx",userRole);
  
  let authStaus=useSelector(state=>state.auth.isAuthenticated);

  
  return (
    <>
  <section className="bg-blue-500 text-white py-20 w-100% h-[92vh] flex flex-wrap items-center">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold mb-4">Welcome to S.M Central Academy</h2>
      <p className="text-lg mb-8">Empowering students to achieve excellence in education and life.</p>
      <a href="#" className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">Apply Now</a>
    </div>
  </section>

  {
    (userRole=='admin' && authStaus) && <section className="container mx-auto py-12 w-100%">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-box">
      <button className='cursor-pointer' onClick={()=>navigate("/studentform")}>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Admissions</h3>
          <p className="text-gray-700">Learn about our admission process and requirements.</p>
        </div>
      </button>
      <button className='cursor-pointer'>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Calendar</h3>
          <p className="text-gray-700">Stay updated with important school events and dates.</p>
        </div>
      </button>
      <button className='cursor-pointer'>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">News</h3>
          <p className="text-gray-700">Read the latest news and announcements.</p>
        </div>
      </button>
    </div>
  </section>
  }

  <section className="container mx-auto py-12 w-100%">
    <h2 className="text-3xl font-bold text-center mb-8">Latest News</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">School Reopening</h3>
        <p className="text-gray-700">The school will reopen on January 10th, 2024. Please check the updated schedule.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Sports Day</h3>
        <p className="text-gray-700">Join us for our annual Sports Day on January 20th, 2024.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Exam Results</h3>
        <p className="text-gray-700">The results for the final exams will be announced on January 15th, 2024.</p>
      </div>
    </div>
  </section>
    </>
  )
}

export default Home
