import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassSectionManager = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newSection, setNewSection] = useState({
    name: '',
    studentCount: '',
    capacity: ''
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/classes`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const fetchedClasses = Array.isArray(response.data) ? response.data : [];
      setClasses(fetchedClasses);
      if (fetchedClasses.length > 0) {
        setSelectedClass(fetchedClasses[0].name);
        fetchSections(fetchedClasses[0].name);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    }
  };

  const fetchSections = async (className) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/classes/${className}/sections`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      setSections(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSections([]);
    }
  };

  const handleClassChange = (e) => {
    const className = e.target.value;
    setSelectedClass(className);
    fetchSections(className);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSection = async () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    
    if (!newSection.name || !newSection.studentCount || !newSection.capacity) {
      alert('Please fill in all fields');
      return;
    }

    const studentCount = parseInt(newSection.studentCount);
    const capacity = parseInt(newSection.capacity);

    if (studentCount > capacity) {
      alert('Student count cannot exceed capacity');
      return;
    }

    const sectionData = {
      name: newSection.name,
      studentCount: studentCount,
      capacity: capacity
    };

    const token = localStorage.getItem('authToken');
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/classes/${selectedClass}/sections`, sectionData, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      fetchSections(selectedClass);
      setNewSection({ name: '', studentCount: '', capacity: '' });
    } catch (error) {
      console.error("Error adding section:", error);
      alert('Failed to add section. Please try again.');
    }
  };

  const handleCapacityChange = async (index, newCapacity) => {
    const capacity = parseInt(newCapacity);
    if (isNaN(capacity) || capacity < 0) {
      alert('Please enter a valid capacity');
      return;
    }

    const section = sections[index];
    if (capacity < section.studentCount) {
      alert('Capacity cannot be less than current student count');
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/classes/${selectedClass}/sections/${section.name}`, 
        { ...section, capacity },
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      fetchSections(selectedClass);
    } catch (error) {
      console.error("Error updating capacity:", error);
      alert('Failed to update capacity. Please try again.');
    }
  };

  return (
    <div className={`min-h-[80vh] ${selectedClass ? 'min-h-fit' : ''} p-5 max-w-6xl mx-auto`}>
      {/* Class Selection */}
      <div className="mb-5 flex justify-center items-center w-full pt-5">
        <div className="flex flex-col gap-4 items-center">
          <label htmlFor="classSelect" className="text-xl md:text-2xl font-medium text-gray-700">
            Select Class:
          </label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={handleClassChange}
            className="p-2 text-base w-[min(300px,80vw)] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a Class --</option>
            {classes.map(cls => (
              <option key={cls.name} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections Table and Form */}
      {selectedClass && (
        <div className="w-full">
          <h3 className="text-center text-lg md:text-xl font-semibold text-gray-800 mb-5">
            Sections for {selectedClass}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mb-5 min-w-[400px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-center min-w-[100px]">Section Name</th>
                  <th className="border border-gray-300 p-2 text-center min-w-[100px]">Student Count</th>
                  <th className="border border-gray-300 p-2 text-center min-w-[100px]">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {sections.length > 0 ? (
                  sections.map((section, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-center">{section.name}</td>
                      <td className="border border-gray-300 p-2 text-center">{section.studentCount}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <input
                          type="number"
                          value={section.capacity}
                          onChange={(e) => handleCapacityChange(index, e.target.value)}
                          className="w-20 p-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min={section.studentCount}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border border-gray-300 p-2 text-center">
                      No sections found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Section Form */}
          <div className="border border-gray-300 p-4 rounded-md">
            <h4 className="text-base md:text-lg font-medium mb-4 text-gray-700">Add New Section</h4>
            <div className="flex flex-col gap-3 mb-4 items-center">
              <input
                type="text"
                name="name"
                value={newSection.name}
                onChange={handleInputChange}
                placeholder="Section Name (e.g., A)"
                className="p-2 w-[min(250px,80vw)] border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="studentCount"
                value={newSection.studentCount}
                onChange={handleInputChange}
                placeholder="Student Count"
                className="p-2 w-[min(250px,80vw)] border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <input
                type="number"
                name="capacity"
                value={newSection.capacity}
                onChange={handleInputChange}
                placeholder="Section Capacity"
                className="p-2 w-[min(250px,80vw)] border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <button
              onClick={handleAddSection}
              className="block mx-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-[min(150px,50vw)]"
            >
              Add Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSectionManager;