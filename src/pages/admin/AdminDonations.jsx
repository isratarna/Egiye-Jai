import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/donations');
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`/api/donations/${id}`, { paymentStatus: newStatus });
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  };

  const filteredDonations = donations.filter(donation => {
    if (filter === 'all') return true;
    return donation.paymentStatus === filter;
  });

  return (
    <div className="admin-donations">
      <h2>Donation Management</h2>
      
      <div className="filter-controls">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('failed')}>Failed</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="donations-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map(donation => (
              <tr key={donation._id}>
                <td>{donation.isAnonymous ? 'Anonymous' : donation.donorName}</td>
                <td>${donation.amount}</td>
                <td>{donation.donationType}</td>
                <td>
                  <select 
                    value={donation.paymentStatus}
                    onChange={(e) => handleStatusUpdate(donation._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => console.log(donation)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDonations;
