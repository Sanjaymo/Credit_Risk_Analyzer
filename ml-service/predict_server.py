"""Flask ML prediction server for SmartLoan Analyzer."""
import json
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and metadata
model = joblib.load('model.pkl')
with open('model_metrics.json', 'r') as f:
    model_metrics = json.load(f)
with open('dataset_stats.json', 'r') as f:
    dataset_stats = json.load(f)

FEATURES = ['age', 'monthly_income', 'loan_amount', 'credit_score',
            'employment_years', 'existing_loans']


def classify_risk(probability):
    """Classify risk level and generate recommendation."""
    if probability < 0.3:
        return 'Low Risk', 'Approve — borrower shows strong repayment potential.'
    elif probability < 0.6:
        return 'Medium Risk', 'Manual Review — additional verification recommended.'
    else:
        return 'High Risk', 'Decline — high likelihood of default.'


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        values = np.array([[
            float(data['age']),
            float(data['monthly_income']),
            float(data['loan_amount']),
            float(data['credit_score']),
            float(data['employment_years']),
            float(data['existing_loans']),
        ]])
    except (KeyError, ValueError) as e:
        return jsonify({'error': f'Invalid input: {e}'}), 400

    probability = float(model.predict_proba(values)[0][1])
    risk_level, recommendation = classify_risk(probability)

    return jsonify({
        'default_probability': round(probability, 4),
        'risk_level': risk_level,
        'recommendation': recommendation
    })


@app.route('/stats', methods=['GET'])
def stats():
    return jsonify(dataset_stats)


@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify(model_metrics)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'model_loaded': True})


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8000))
    print(f"SmartLoan ML Service running on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG', 'true').lower() == 'true')
