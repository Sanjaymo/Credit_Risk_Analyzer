const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const Prediction = require('../models/Prediction');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const validatePrediction = [
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('monthlyIncome').isFloat({ min: 0 }).withMessage('Monthly income must be positive'),
  body('loanAmount').isFloat({ min: 0 }).withMessage('Loan amount must be positive'),
  body('creditScore').isInt({ min: 300, max: 850 }).withMessage('Credit score must be 300-850'),
  body('employmentYears').isFloat({ min: 0 }).withMessage('Employment years must be positive'),
  body('existingLoans').isInt({ min: 0 }).withMessage('Existing loans must be non-negative')
];

// POST /api/predict
router.post('/predict', validatePrediction, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { age, monthlyIncome, loanAmount, creditScore, employmentYears, existingLoans } = req.body;

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
      age,
      monthly_income: monthlyIncome,
      loan_amount: loanAmount,
      credit_score: creditScore,
      employment_years: employmentYears,
      existing_loans: existingLoans
    });

    const { default_probability, risk_level, recommendation } = mlResponse.data;

    // Try to save to MongoDB, but don't block the response if it fails
    let savedId = null;
    try {
      const prediction = new Prediction({
        age,
        monthlyIncome,
        loanAmount,
        creditScore,
        employmentYears,
        existingLoans,
        defaultProbability: default_probability,
        riskLevel: risk_level,
        recommendation
      });
      await prediction.save();
      savedId = prediction._id;
    } catch (dbError) {
      console.warn('MongoDB save failed (DB may be offline):', dbError.message);
    }

    res.json({
      defaultProbability: default_probability,
      riskLevel: risk_level,
      recommendation,
      id: savedId
    });
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ error: 'Failed to process prediction. Ensure ML service is running.' });
  }
});

// GET /api/predictions
router.get('/predictions', async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ createdAt: -1 }).limit(50);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/stats`);
    res.json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/model-info
router.get('/model-info', async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/model-info`);
    res.json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch model info' });
  }
});

module.exports = router;
