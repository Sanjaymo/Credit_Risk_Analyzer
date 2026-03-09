# SmartLoan Analyzer

A machine learning-powered credit risk prediction system built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) and Python ML service.

## Overview

SmartLoan Analyzer simulates how banks and fintech companies evaluate loan applications. Users can enter borrower details and receive risk predictions powered by a trained Logistic Regression model.

**Key Features:**
- Credit risk prediction with probability scores
- Risk gauge visualization (Low / Medium / High)
- Interactive data visualizations and charts
- ML model explanation with performance metrics
- Prediction history stored in MongoDB

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17 (Standalone Components) |
| Backend API | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| ML Service | Python + Flask + scikit-learn |
| Charts | Chart.js |

## Project Structure

```
Credit_Risk_Analyzer/
├── backend/                  # Express.js API server
│   ├── config/db.js         # MongoDB connection
│   ├── models/Prediction.js # Mongoose schema
│   ├── routes/api.js        # API routes
│   ├── server.js            # Entry point
│   └── package.json
├── ml-service/              # Python ML microservice
│   ├── generate_dataset.py  # Synthetic data generator
│   ├── train_model.py       # Model training script
│   ├── predict_server.py    # Flask prediction API
│   └── requirements.txt
├── frontend/                # Angular 17 application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # UI components
│   │   │   ├── services/    # API services
│   │   │   └── ...
│   │   └── ...
│   ├── angular.json
│   └── package.json
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)
- Angular CLI (`npm install -g @angular/cli`)

### 1. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
python generate_dataset.py
python train_model.py
python predict_server.py
```
The ML service runs on `http://localhost:8000`.

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```
The API server runs on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```
The Angular app runs on `http://localhost:4200`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Submit borrower data for prediction |
| GET | `/api/predictions` | Get prediction history |
| GET | `/api/stats` | Get dataset statistics |
| GET | `/api/model-info` | Get model performance metrics |

## Model Details

- **Algorithm:** Logistic Regression
- **Dataset:** 10,000 synthetic loan records
- **Features:** Age, Monthly Income, Loan Amount, Credit Score, Employment Years, Existing Loans
- **Accuracy:** ~87%

## Author

**Sanjay Choudhari** — Data Science Enthusiast
