import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();
  let userRole = useSelector((state) => state.auth?.user?.role);
  let authStatus = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <section className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
        {/* Hero Section with Fancy Background */}
        <section
          className="text-gray-800 py-20 w-full h-[92vh] flex flex-wrap items-center"
        >
          <div className="container mx-auto text-center px-4 sm:px-6">
            <h1 className="lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold mb-6 text-gray-800">
              <div className="waves text-gray-700" data-word="Welcome to S.M Central Academy">
                Welcome to S.M Central Academy
              </div>
            </h1>
            <p className="lg:text-lg md:text-base sm:text-sm text-xs mb-8">
              Empowering students to achieve excellence in education and life.
            </p>
            <a
              href="#"
              className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 text-sm sm:text-base"
            >
              Apply Now
            </a>
          </div>
        </section>

        {/* Admin Section */}
        {userRole === "admin" && authStatus && (
          <section className="container mx-auto py-12 w-full px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
        <h2 className="text-3xl font-bold text-center mb-8 border-b-2 border-gray-800 text-gray-800 pb-4">
          Latest News
        </h2>
        <section className="py-12 w-full container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <button 
              className="cursor-pointer"
              onClick={() => { 
                window.scrollTo(0, 0);
                navigate("/time-table")}}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-between">
                <h3 className="lg:text-xl text-lg font-medium mb-4 text-gray-800">School Time Table</h3>
                <p className="text-gray-700 flex-grow">
                  Get the Latest Time Table of School;
                </p>
              </div>
            </button>
            <button
            
            className="cursor-pointer"
            onClick={() =>{window.scrollTo(0, 0);
                       navigate("/hall-of-fame")}}>
            <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-between">
              <h3 className="lg:text-xl text-lg font-medium mb-4 text-gray-800">Hall of Fame</h3>
              <p className="text-gray-700 flex-grow">
                Top Student who scored highest in the exams & Sports;
              </p>
            </div>
            </button>
            <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-between">
              <h3 className="lg:text-xl text-lg font-medium mb-4 text-gray-800">Exam Results</h3>
              <p className="text-gray-700 flex-grow">
                The results for the final exams will be announced on January 15th, 2024.
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Home;