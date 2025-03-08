import React, { useState } from 'react';

const ClassSectionManager = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({
    name: '',
    studentCount: ''
  });

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

  const classSections = {
    'Class 1': [
      { name: 'A', studentCount: 30 },
      { name: 'B', studentCount: 25 }
    ],
    'Class 2': [
      { name: 'A', studentCount: 28 },
      { name: 'B', studentCount: 32 }
    ],
    'Class 3': [],
    'Class 4': [],
    'Class 5': []
  };

  const handleClassChange = (e) => {
    const className = e.target.value;
    setSelectedClass(className);
    setSections(classSections[className] || []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSection = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    
    if (!newSection.name || !newSection.studentCount) {
      alert('Please fill in all fields');
      return;
    }

    const updatedSections = [...sections, {
      name: newSection.name,
      studentCount: parseInt(newSection.studentCount)
    }];

    setSections(updatedSections);
    setNewSection({ name: '', studentCount: '' });
    classSections[selectedClass] = updatedSections;
  };

  return (
    <div 
      style={{ 
        minHeight: selectedClass ? 'auto' : '80vh',
        padding: '20px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {/* Class Selection */}
      <div 
        style={{ 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          paddingTop: selectedClass ? '0' : '20px' // Adds some top padding when no class is selected
        }}
      >
        <div 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            alignItems: 'center'
          }}
        >
          <label 
            htmlFor="classSelect" 
            style={{ 
              fontSize: '1.2rem'
            }}
          >
            Select Class:
          </label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={handleClassChange}
            style={{ 
              padding: '8px 12px',
              fontSize: '1rem',
              width: 'min(300px, 80vw)',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="">-- Select a Class --</option>
            {classes.map(className => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections Table and Form */}
      {selectedClass && (
        <div style={{ width: '100%' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
            Sections for {selectedClass}
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table 
              style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '20px',
                minWidth: '300px'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '100px' }}>
                    Section Name
                  </th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '100px' }}>
                    Student Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections.length > 0 ? (
                  sections.map((section, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        {section.name}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        {section.studentCount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan="2" 
                      style={{ 
                        border: '1px solid #ddd', 
                        padding: '8px', 
                        textAlign: 'center' 
                      }}
                    >
                      No sections found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Section Form */}
          <div 
            style={{ 
              border: '1px solid #ddd', 
              padding: '15px',
              borderRadius: '4px'
            }}
          >
            <h4 style={{ marginBottom: '15px' }}>Add New Section</h4>
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '15px',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                name="name"
                value={newSection.name}
                onChange={handleInputChange}
                placeholder="Section Name (e.g., A)"
                style={{ 
                  padding: '8px', 
                  width: 'min(250px, 80vw)',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
              <input
                type="number"
                name="studentCount"
                value={newSection.studentCount}
                onChange={handleInputChange}
                placeholder="Student Count"
                style={{ 
                  padding: '8px', 
                  width: 'min(250px, 80vw)',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
                min="0"
              />
            </div>
            <button
              onClick={handleAddSection}
              style={{
                padding: '8px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: 'min(150px, 50vw)',
                display: 'block',
                margin: '0 auto'
              }}
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