import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HallOfFame from '../assets/admin-rel/otherfunction/HallOfFame.jpg';
import TimeTable from '../assets/admin-rel/otherfunction/timetable.png';
import BlogNews from '../assets/teacher-rel/Blog:News.jpg';

function Home() {
  const navigate = useNavigate();
  let userRole = useSelector((state) => state.auth?.user?.role);
  let authStatus = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <section className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
        {/* Hero Section with Fancy Background */}
        <section
          className="text-gray-800 py-16 w-full h-[92vh] flex flex-wrap items-center"
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
          <section className="container mx-auto py-10 w-full px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              <button
                className="cursor-pointer"
                onClick={() => navigate("/studentform")}
              >
                <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-full max-w-[280px] mx-auto">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">Admissions</h3>
                  <p className="text-gray-700 text-sm">
                    Learn about our admission process and requirements.
                  </p>
                </div>
              </button>
              <button className="cursor-pointer">
                <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-full max-w-[280px] mx-auto">
                  <h3 className="text-lg font-bold mb-3">Calendar</h3>
                  <p className="text-gray-700 text-sm">
                    Stay updated with important school events and dates.
                  </p>
                </div>
              </button>
              <button className="cursor-pointer">
                <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-full max-w-[280px] mx-auto">
                  <h3 className="text-lg font-bold mb-3">News</h3>
                  <p className="text-gray-700 text-sm">
                    Read the latest news and announcements.
                  </p>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Latest News Section */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 border-b-2 border-gray-800 text-gray-800 pb-3">
          Latest News
        </h2>
        <section className="py-10 w-full container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <button
              className="cursor-pointer"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/time-table");
              }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg h-full flex flex-col justify-between hover:shadow-xl transition duration-300 w-full max-w-[280px] mx-auto">
                <div>
                  <img
                    src={TimeTable}
                    alt="School Time Table"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-300 object-cover mx-auto mb-3"
                  />
                  <h3 className="text-base sm:text-lg font-medium mb-3 text-gray-800 text-center">School Time Table</h3>
                  <p className="text-gray-700 text-sm flex-grow text-center">
                    Get the Latest Time Table of School
                  </p>
                </div>
              </div>
            </button>
            <button
              className="cursor-pointer"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/hall-of-fame");
              }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg h-full flex flex-col justify-between hover:shadow-xl transition duration-300 w-full max-w-[280px] mx-auto">
                <div>
                  <img
                    src={HallOfFame}
                    alt="Hall of Fame"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-300 object-cover mx-auto mb-3"
                  />
                  <h3 className="text-base sm:text-lg font-medium mb-3 text-gray-800 text-center">Hall of Fame</h3>
                  <p className="text-gray-700 text-sm flex-grow text-center">
                    Top Students who scored highest in exams & sports
                  </p>
                </div>
              </div>
            </button>
            <button
              className="cursor-pointer"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/blog-news");
              }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg h-full flex flex-col justify-between hover:shadow-xl transition duration-300 w-full max-w-[280px] mx-auto">
                <div>
                  <img
                    src={BlogNews}
                    alt="Hall of Fame"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-300 object-cover mx-auto mb-3"
                  />
                  <h3 className="text-base sm:text-lg font-medium mb-3 text-gray-800 text-center">Blogs News</h3>
                  <p className="text-gray-700 text-sm flex-grow text-center">
                    Read the latest blogs and news articles.
                  </p>
                </div>
              </div>
            </button>
            
          </div>
        </section>
      </section>
    </>
  );
}

export default Home;