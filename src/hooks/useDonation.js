import { useState, useCallback } from 'react';
import axios from 'axios';

export const useDonationForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    donationType: 'one-time',
    donorName: '',
    donorEmail: '',
    message: '',
    isAnonymous: false,
    purpose: 'general'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (formData.amount > 1000000) {
      newErrors.amount = 'Amount cannot exceed $1,000,000';
    }
    
    if (!formData.isAnonymous && !formData.donorName.trim()) {
      newErrors.donorName = 'Donor name is required';
    }
    
    if (!formData.isAnonymous && !formData.donorEmail.trim()) {
      newErrors.donorEmail = 'Email is required';
    } else if (formData.donorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donorEmail)) {
      newErrors.donorEmail = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const submitDonation = useCallback(async () => {
    if (!validateForm()) return false;
    
    try {
      setLoading(true);
      const response = await axios.post('/api/donations', formData);
      return response.data;
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Submission failed' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm]);

  return {
    formData,
    errors,
    loading,
    handleChange,
    submitDonation,
    setFormData,
    setErrors
  };
};

export const useDonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/donations/user/:userId');
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { donations, loading, fetchDonations };
};
