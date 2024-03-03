import React, { useState } from 'react';
import './App.css';

function App() {
  const [pincode, setPincode] = useState('');
  const [filter, setFilter] = useState('');
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }
    setError(null);
    setLoading(true);
    setShowForm(false);
    setShowFilter(true);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      console.log(data)
      if (data[0].Status === 'Error') {
        setError('Pincode not found');
        setDetails([]);
      } else {
        setDetails(data[0].PostOffice);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
      setError('An error occurred while fetching pincode details. Please try again later.');
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredDetails = details.filter(detail =>
    detail.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Pincode Lookup</h1>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            maxLength="6"
          />
          <button type="submit">Lookup</button>
        </form>
      )}
      {loading && <div className="loader">Loading...</div>}
      {error && <p className="error">{error}</p>}
      {showFilter && (
        <input
          type="text"
          placeholder="Filter by Post Office Name"
          value={filter}
          onChange={handleFilterChange}
        />
      )}
      {!showForm && filteredDetails.length === 0 && <p>No results found</p>}
      <div className="details">
        {filteredDetails.map((detail, index) => (
          <div key={index} className="detail">
            <p><strong>Post Office Name:</strong> {detail.Name}</p>
            <p><strong>Branch Type - Delivery Status:</strong> {detail.BranchType} - {detail.DeliveryStatus}</p>
            <p><strong>District:</strong> {detail.District}</p>
            <p><strong>State:</strong> {detail.State}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;