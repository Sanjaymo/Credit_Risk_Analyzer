# SmartLoan Analyzer

> A machine learning-powered credit risk prediction system — built with the MEAN stack and a Python ML microservice.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white)](https://angular.io)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)](https://python.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%2FLocal-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Flask](https://img.shields.io/badge/Flask-ML%20Service-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com)

---

## 🚀 Live Demo

**[SmartLoan Analyzer → ADD_LINK_HERE](#)**

> Enter borrower details and get an instant ML-powered credit risk assessment.

---

## Overview

**SmartLoan Analyzer** simulates how banks and fintech companies evaluate loan applications. Borrower details are submitted through a clean Angular interface, processed by an Express.js API, and scored by a trained Logistic Regression model — returning a risk prediction with confidence probability in real time.

---

## Key Features

- **Credit Risk Prediction** — Instant risk scoring with probability output
- **Risk Gauge Visualization** — Clear Low / Medium / High risk classification
- **Interactive Charts** — Data visualizations powered by Chart.js
- **Model Transparency** — View ML model performance metrics and explanations
- **Prediction History** — All predictions stored and retrievable via MongoDB

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17 (Standalone Components) |
| Backend API | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| ML Service | Python + Flask + scikit-learn |
| Charts | Chart.js |

---

## Project Structure

```
Credit_Risk_Analyzer/
├── backend/                   # Express.js API server
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── Prediction.js      # Mongoose schema
│   ├── routes/
│   │   └── api.js             # API route definitions
│   ├── server.js              # Entry point
│   └── package.json
│
├── ml-service/                # Python ML microservice
│   ├── generate_dataset.py    # Synthetic dataset generator
│   ├── train_model.py         # Model training script
│   ├── predict_server.py      # Flask prediction API
│   └── requirements.txt
│
├── frontend/                  # Angular 17 application
│   ├── src/
│   │   └── app/
│   │       ├── components/    # UI components
│   │       └── services/      # API service layer
│   ├── angular.json
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure the following are installed before proceeding:

- [Node.js](https://nodejs.org) v18+
- [Python](https://python.org) 3.9+
- [MongoDB](https://mongodb.com) (local instance or Atlas cluster)
- Angular CLI — `npm install -g @angular/cli`

---

### 1. ML Service

```bash
cd ml-service
pip install -r requirements.txt
python generate_dataset.py   # Generate synthetic training data
python train_model.py        # Train the Logistic Regression model
python predict_server.py     # Start the Flask prediction server
```

> Runs on **http://localhost:8000**

---

### 2. Backend API

```bash
cd backend
npm install
npm run dev
```

> Runs on **http://localhost:5000**

---

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

> Runs on **http://localhost:4200**

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/predict` | Submit borrower data and receive a risk prediction |
| `GET` | `/api/predictions` | Retrieve prediction history |
| `GET` | `/api/stats` | Get dataset-level statistics |
| `GET` | `/api/model-info` | Get ML model performance metrics |

---

## ML Model Details

| Property | Details |
|---|---|
| Algorithm | Logistic Regression |
| Training Data | 10,000 synthetic loan records |
| Input Features | Age, Monthly Income, Loan Amount, Credit Score, Employment Years, Existing Loans |
| Model Accuracy | ~87% |

---

## Author

**Sanjay Choudhari** — Data Science Enthusiast

---

*SmartLoan Analyzer is a demonstration project for educational purposes.*