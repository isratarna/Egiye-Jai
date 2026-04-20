import React, { createContext, useState, useCallback, useEffect } from 'react';

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [donationStats, setDonationStats] = useState({
    total: 0,
    count: 0,
    average: 0
  });
  const [loading, setLoading] = useState(false);

  const calculateStats = useCallback((donationsList) => {
    const total = donationsList.reduce((sum, d) => sum + d.amount, 0);
    const count = donationsList.length;
    const average = count > 0 ? total / count : 0;
    
    setTotalDonated(total);
    setDonationStats({
      total,
      count,
      average: Math.round(average * 100) / 100
    });
  }, []);

  const addDonation = useCallback((donation) => {
    setDonations(prev => [donation, ...prev]);
    calculateStats([donation, ...donations]);
  }, [donations, calculateStats]);

  const updateDonation = useCallback((id, updates) => {
    setDonations(prev => 
      prev.map(d => d._id === id ? { ...d, ...updates } : d)
    );
  }, []);

  const removeDonation = useCallback((id) => {
    setDonations(prev => prev.filter(d => d._id !== id));
  }, []);

  return (
    <DonationContext.Provider value={{
      donations,
      totalDonated,
      donationStats,
      loading,
      addDonation,
      updateDonation,
      removeDonation,
      setDonations,
      setLoading
    }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonationContext = () => {
  const context = React.useContext(DonationContext);
  if (!context) {
    throw new Error('useDonationContext must be used within DonationProvider');
  }
  return context;
};
