"""Generate synthetic loan dataset for training the credit risk model (INR scale)."""
import pandas as pd
import numpy as np

np.random.seed(42)
n_samples = 10000

# Indian Rupee scale: income ₹15k–₹3L/month, loans ₹50k–₹50L
data = {
    'age': np.random.randint(18, 70, n_samples),
    'monthly_income': np.clip(np.random.lognormal(mean=10.8, sigma=0.6, size=n_samples), 15000, 500000).astype(int),
    'loan_amount': np.clip(np.random.lognormal(mean=13.0, sigma=0.8, size=n_samples), 50000, 5000000).astype(int),
    'credit_score': np.clip(np.random.normal(680, 80, n_samples), 300, 850).astype(int),
    'employment_years': np.clip(np.random.exponential(5, n_samples), 0, 40).round(1),
    'existing_loans': np.random.poisson(1.5, n_samples),
}

df = pd.DataFrame(data)

# Debt-to-income ratio as key risk factor
dti = df['loan_amount'] / (df['monthly_income'] * 12)

# Create a realistic default signal using normalized features
risk_score = (
    -0.025 * df['credit_score']
    + 1.2 * dti
    + -0.08 * df['employment_years']
    + 0.15 * df['existing_loans']
    + -0.015 * df['age']
    + np.random.normal(0, 1.0, n_samples)
)

# Sigmoid to convert to probability
default_prob = 1 / (1 + np.exp(-(risk_score + 14)))

df['default'] = (default_prob > 0.5).astype(int)

output_path = 'loan_data.csv'
df.to_csv(output_path, index=False)

print(f"Dataset generated: {len(df)} records")
print(f"Default rate: {df['default'].mean():.2%}")
print(f"Saved to {output_path}")
print("\nSample statistics:")
print(df.describe().round(2))
