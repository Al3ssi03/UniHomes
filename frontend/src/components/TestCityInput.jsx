import React, { useState } from 'react';

const TestCityInput = () => {
  const [cityValue, setCityValue] = useState('');
  
  const handleCityChange = (e) => {
    const value = e.target.value;
    console.log('🏙️ City input changed to:', value);
    setCityValue(value);
  };
  
  const testSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('🧪 Test Form Submission:');
    console.log('- State value:', cityValue);
    console.log('- Form element value:', e.target.elements.citta.value);
    console.log('- FormData value:', formData.get('citta'));
    
    // Alert for visual confirmation
    alert(`City Test Results:\nState: "${cityValue}"\nForm Element: "${e.target.elements.citta.value}"\nFormData: "${formData.get('citta')}"`);
  };
  
  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', margin: '20px', borderRadius: '8px' }}>
      <h3>🧪 City Input Test Component</h3>
      <form onSubmit={testSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>City (State Controlled):</label>
          <input
            type="text"
            name="citta"
            value={cityValue}
            onChange={handleCityChange}
            placeholder="Type a city name..."
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Current State Value:</strong> "{cityValue}"
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Test Submit
        </button>
      </form>
    </div>
  );
};

export default TestCityInput;
