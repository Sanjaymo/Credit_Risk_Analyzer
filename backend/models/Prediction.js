const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  monthlyIncome: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
  creditScore: { type: Number, required: true },
  employmentYears: { type: Number, required: true },
  existingLoans: { type: Number, required: true },
  defaultProbability: { type: Number },
  riskLevel: { type: String },
  recommendation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
