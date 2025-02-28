import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import './Home.css'

function Home() {
  const navigate = useNavigate();
  let userRole = useSelector((state) => state.auth?.user?.role);
  console.log("User Role is from home.jsx", userRole);

  let authStatus = useSelector((state) => state.auth.isAuthenticated);

  
  return (
    <>
      <section className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
        {/* Hero Section with Fancy Background */}
      <section
        className=" text-gray-800 py-20 w-full h-[92vh] flex flex-wrap items-center animate-gradient"
        style={{
          backgroundSize: "200% 200%",
          animation: "gradientMove 10s ease infinite",
        }}
      >
        <div className="container mx-auto text-center">
          
          <h1 className="text-gray-800  lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold mb-6">Welcome to S.M Central Academy</h1>
          <p className="lg:text-lg md:text-base sm:text-sm text-sm mb-8">
            Empowering students to achieve excellence in education and life.
          </p>
          <a
            href="#"
            className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Admin Section */}
      {userRole === "admin" && authStatus && (
        <section className="container mx-auto py-12 w-full ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <button
              className="cursor-pointer"
              onClick={() => navigate("/studentform")}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Admissions</h3>
                <p className="text-gray-700">
                  Learn about our admission process and requirements.
                </p>
              </div>
            </button>
            <button className="cursor-pointer">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-bold mb-4">Calendar</h3>
                <p className="text-gray-700">
                  Stay updated with important school events and dates.
                </p>
              </div>
            </button>
            <button className="cursor-pointer">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-bold mb-4">News</h3>
                <p className="text-gray-700">
                  Read the latest news and announcements.
                </p>
              </div>
            </button>
          </div>
        </section>
      )}

      {/* Latest News Section */}
      <h2 className="text-3xl font-bold text-center mb-8 border-b-2 border-gray-800  text-gray-800 pb-4">Latest News</h2>
      <section className="py-12 w-full  container mx-auto ">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg m-4 ">
            <h3 className="lg:text-xl text-lg font-medium mb-4 text-gray-800">School Reopening</h3>
            <p className="text-gray-700">
              The school will reopen on January 10th, 2024. Please check the
              updated schedule.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg m-4">
            <h3 className="lg:text-xl text-lg font-medium mb-4 text-gray-800">Sports Day</h3>
            <p className="text-gray-700">
              Join us for our annual Sports Day on January 20th, 2024.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg m-4">
            <h3 className="lg:text-xl text-lg font-medium mb-4 text-gray-800">Exam Results</h3>
            <p className="text-gray-700">
              The results for the final exams will be announced on January
              15th, 2024.
            </p>
          </div>
        </div>
      </section>

      
      
      </section>
    </>
  );
}

export default Home;