"""Train the credit risk prediction model and save artifacts."""
import pandas as pd
import numpy as np
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)

# Load dataset
df = pd.read_csv('loan_data.csv')
print(f"Loaded {len(df)} records")
print(f"Default rate: {df['default'].mean():.2%}")

features = ['age', 'monthly_income', 'loan_amount', 'credit_score',
            'employment_years', 'existing_loans']
X = df[features]
y = df['default']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Build pipeline with scaling + logistic regression
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression(random_state=42, max_iter=1000))
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
y_proba = pipeline.predict_proba(X_test)[:, 1]

# Metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)

print(f"\n--- Model Performance ---")
print(f"Accuracy:  {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1 Score:  {f1:.4f}")
print(f"Confusion Matrix:\n{cm}")

# Feature importance (coefficients)
coefs = pipeline.named_steps['model'].coef_[0]
importance = dict(zip(features, np.abs(coefs).round(4).tolist()))

# Save model
joblib.dump(pipeline, 'model.pkl')
print("\nModel saved to model.pkl")

# Save metrics
metrics = {
    'accuracy': round(accuracy, 4),
    'precision': round(precision, 4),
    'recall': round(recall, 4),
    'f1_score': round(f1, 4),
    'confusion_matrix': cm.tolist(),
    'feature_importance': importance,
    'dataset_size': len(df),
    'features': features,
    'algorithm': 'Logistic Regression',
    'test_size': len(X_test),
    'train_size': len(X_train)
}
with open('model_metrics.json', 'w') as f:
    json.dump(metrics, f, indent=2)
print("Metrics saved to model_metrics.json")

# Save dataset statistics for the API
stats = {
    'total_records': len(df),
    'default_rate': round(df['default'].mean(), 4),
    'feature_stats': {},
    'default_by_income_bracket': {},
    'default_by_credit_bracket': {},
    'loan_amount_distribution': {},
    'age_distribution': {}
}

for feat in features:
    stats['feature_stats'][feat] = {
        'mean': round(float(df[feat].mean()), 2),
        'std': round(float(df[feat].std()), 2),
        'min': round(float(df[feat].min()), 2),
        'max': round(float(df[feat].max()), 2)
    }

# Income brackets (INR)
income_bins = [0, 25000, 50000, 75000, 100000, 150000, 10000000]
income_labels = ['<25k', '25k-50k', '50k-75k', '75k-1L', '1L-1.5L', '1.5L+']
df['income_bracket'] = pd.cut(df['monthly_income'], bins=income_bins, labels=income_labels)
for bracket in income_labels:
    subset = df[df['income_bracket'] == bracket]
    if len(subset) > 0:
        stats['default_by_income_bracket'][bracket] = {
            'count': int(len(subset)),
            'default_rate': round(float(subset['default'].mean()), 4)
        }

# Credit score brackets
credit_bins = [300, 500, 600, 700, 750, 850]
credit_labels = ['300-500', '500-600', '600-700', '700-750', '750-850']
df['credit_bracket'] = pd.cut(df['credit_score'], bins=credit_bins, labels=credit_labels)
for bracket in credit_labels:
    subset = df[df['credit_bracket'] == bracket]
    if len(subset) > 0:
        stats['default_by_credit_bracket'][bracket] = {
            'count': int(len(subset)),
            'default_rate': round(float(subset['default'].mean()), 4)
        }

# Loan amount distribution (INR)
loan_bins = [0, 100000, 300000, 500000, 1000000, 2000000, 100000000]
loan_labels = ['<1L', '1L-3L', '3L-5L', '5L-10L', '10L-20L', '20L+']
df['loan_bracket'] = pd.cut(df['loan_amount'], bins=loan_bins, labels=loan_labels)
for bracket in loan_labels:
    count = len(df[df['loan_bracket'] == bracket])
    stats['loan_amount_distribution'][bracket] = int(count)

# Age distribution
age_bins = [18, 25, 35, 45, 55, 70]
age_labels = ['18-25', '25-35', '35-45', '45-55', '55-70']
df['age_bracket'] = pd.cut(df['age'], bins=age_bins, labels=age_labels)
for bracket in age_labels:
    count = len(df[df['age_bracket'] == bracket])
    stats['age_distribution'][bracket] = int(count)

with open('dataset_stats.json', 'w') as f:
    json.dump(stats, f, indent=2)
print("Dataset statistics saved to dataset_stats.json")
