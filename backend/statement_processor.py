
import pandas as pd
import json
from datetime import datetime

def categorize_transaction(description):
    """Categorizes a transaction based on keywords in its description."""
    description = str(description).lower()
    # Simple categorization rules
    if 'uber' in description or 'lyft' in description or 'transport' in description:
        return 'Transport'
    if 'groceries' in description or 'supermarket' in description or 'walmart' in description:
        return 'Groceries'
    if 'rent' in description:
        return 'Rent'
    if 'spotify' in description or 'netflix' in description or 'hulu' in description:
        return 'Entertainment'
    if 'restaurant' in description or 'cafe' in description or 'food' in description:
        return 'Food & Dining'
    if 'pharmacy' in description or 'health' in description:
        return 'Health'
    if 'salary' in description or 'payroll' in description:
        return 'Income'
    return 'Miscellaneous'

def find_recurring_transactions(df):
    """Identifies recurring transactions based on description and frequency."""
    # Consider transactions that are expenses
    expenses = df[df['Amount'] < 0].copy()
    # Normalize description for grouping
    expenses['NormalizedDescription'] = expenses['Description'].str.lower().str.strip()

    # Group by normalized description and count occurrences
    grouped = expenses.groupby('NormalizedDescription').agg(
        count=('Amount', 'size'),
        mean_amount=('Amount', 'mean'),
        std_dev=('Amount', 'std'),
        dates=('Date', lambda x: list(x))
    ).reset_index()

    # Filter for potential recurring transactions
    # Criteria: Occurs more than once, and the amount is consistent (low standard deviation)
    recurring = grouped[
        (grouped['count'] > 1) &
        (grouped['std_dev'].fillna(0) < 5.0) # Allow for small variations in amount
    ]

    recurring_list = []
    for _, row in recurring.iterrows():
        # Check if dates are roughly monthly apart
        dates = sorted(pd.to_datetime(row['dates']))
        if len(dates) > 1:
            # Calculate the average number of days between transactions
            avg_delta = (dates[-1] - dates[0]).days / (len(dates) - 1)
            # Consider it monthly if the average delta is between 25 and 35 days
            if 25 <= avg_delta <= 35:
                recurring_list.append({
                    'description': row['NormalizedDescription'].title(),
                    'amount': abs(round(row['mean_amount'], 2)),
                    'frequency': 'Monthly'
                })

    return recurring_list


def process_statement(csv_path):
    """
    Processes a bank statement CSV file and returns a JSON object with financial analysis.
    Assumes CSV has columns: 'Date', 'Description', 'Amount'
    """
    try:
        df = pd.read_csv(csv_path)
        df.columns = ['Date', 'Description', 'Amount'] # Standardize column names
    except FileNotFoundError:
        return json.dumps({"error": "File not found. Please provide a valid path."})
    except Exception as e:
        return json.dumps({"error": f"Error reading CSV: {e}"})

    # --- Data Cleaning and Preparation ---
    df['Date'] = pd.to_datetime(df['Date'])
    df['Amount'] = pd.to_numeric(df['Amount'])

    # --- Core Calculations ---
    total_income = df[df['Amount'] > 0]['Amount'].sum()
    total_expenses = abs(df[df['Amount'] < 0]['Amount'].sum())
    net_savings = total_income - total_expenses

    # --- Categorization ---
    df['Category'] = df['Description'].apply(categorize_transaction)
    # Exclude income from spending breakdown
    spending_df = df[df['Amount'] < 0].copy()
    spending_df['Amount'] = abs(spending_df['Amount'])
    spending_breakdown = spending_df.groupby('Category')['Amount'].sum().round(2).to_dict()

    # --- Highest Expense ---
    highest_expense_transaction = df.loc[df[df['Amount'] < 0]['Amount'].idxmin()]
    highest_expense = {
        'description': highest_expense_transaction['Description'],
        'amount': abs(highest_expense_transaction['Amount'])
    }

    # --- Recurring Transactions ---
    recurring_transactions = find_recurring_transactions(df)

    # --- Format Transactions for Output ---
    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
    transactions = df.sort_values(by='Date', ascending=False).to_dict('records')

    # --- Compile Final JSON Output ---
    output = {
        'total_income': round(total_income, 2),
        'total_expenses': round(total_expenses, 2),
        'net_savings': round(net_savings, 2),
        'highest_expense': highest_expense,
        'spending_breakdown': spending_breakdown,
        'recurring_transactions': recurring_transactions,
        'transactions': transactions
    }

    return json.dumps(output, indent=4)

if __name__ == '__main__':
    # This is a dummy CSV file for testing purposes.
    # In a real application, the user would upload this file.
    dummy_data = {
        'Date': ['2025-06-01', '2025-06-05', '2025-06-10', '2025-06-12', '2025-06-15', '2025-06-20', '2025-06-25', '2025-07-01'],
        'Description': ['Rent', 'Salary', 'Spotify', 'Uber', 'Groceries Store', 'Netflix', 'Restaurant Food', 'Rent'],
        'Amount': [-1200, 5000, -10.99, -25.50, -150.75, -15.99, -45.20, -1200]
    }
    dummy_df = pd.DataFrame(dummy_data)
    dummy_csv_path = 'dummy_statement.csv'
    dummy_df.to_csv(dummy_csv_path, index=False)

    # Process the dummy file and print the output
    json_output = process_statement(dummy_csv_path)
    print(json_output)
