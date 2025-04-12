import React, { useState, useEffect } from "react";
import axios from "axios";

const HallOfFame = () => {
  const [hallOfFameData, setHallOfFameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  const fetchHallOfFameData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:9090/api/public/getHallOfFame");
      setHallOfFameData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching Hall of Fame data:", err);
      setError("Failed to load Hall of Fame data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHallOfFameData();
  }, []);

  // Optional: Function to refresh data (can be passed to CreateHallOfFame)
  const refreshData = () => {
    fetchHallOfFameData();
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-6 sm:mb-8 md:mb-10">
          Hall of Fame
        </h1>
        <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto">
          Celebrating the outstanding achievements of our remarkable individuals who have made a lasting impact.
        </p>

        {loading ? (
          <div className="text-center text-gray-600 text-sm sm:text-base">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-sm sm:text-base">
            {error}
          </div>
        ) : hallOfFameData.length === 0 ? (
          <div className="text-center text-gray-600 text-sm sm:text-base">
            No Hall of Fame entries found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {hallOfFameData.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full mb-3 sm:mb-4 object-cover border-4 border-blue-500"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150"; // Fallback image
                  }}
                />
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                  {member.name}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  {member.achievement}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFame;