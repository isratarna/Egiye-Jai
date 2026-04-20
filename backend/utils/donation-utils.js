const handleDonationError = (error, res) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }
  
  if (error.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate transaction ID'
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  return res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

const validateDonationAmount = (amount) => {
  if (!amount || isNaN(amount)) return false;
  if (amount < 0.01) return false;
  return amount <= 1000000;
};

const validateDonorEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  handleDonationError,
  validateDonationAmount,
  validateDonorEmail
};
