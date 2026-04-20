import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DonatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    donationType: 'one-time',
    donorName: '',
    donorEmail: '',
    message: '',
    isAnonymous: false,
    purpose: 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/donations', formData);
      navigate('/donation-result', { state: { donation: response.data } });
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Error processing donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-page">
      <h1>Make a Donation</h1>
      
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label>Donation Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            placeholder="Enter amount"
          />
        </div>

        <div className="form-group">
          <label>Donation Type</label>
          <select name="donationType" value={formData.donationType} onChange={handleChange}>
            <option value="one-time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>

        <div className="form-group">
          <label>Purpose</label>
          <select name="purpose" value={formData.purpose} onChange={handleChange}>
            <option value="general">General Fund</option>
            <option value="emergency">Emergency Relief</option>
            <option value="project">Specific Project</option>
          </select>
        </div>

        <div className="form-group">
          <label>Donor Name</label>
          <input
            type="text"
            name="donorName"
            value={formData.donorName}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label>Donor Email</label>
          <input
            type="email"
            name="donorEmail"
            value={formData.donorEmail}
            onChange={handleChange}
            placeholder="Your email"
          />
        </div>

        <div className="form-group">
          <label>Message (Optional)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Share your thoughts..."
            rows="4"
          />
        </div>

        <div className="form-group checkbox">
          <input
            type="checkbox"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
          />
          <label>Donate Anonymously</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Donate Now'}
        </button>
      </form>
    </div>
  );
};

export default DonatePage;
