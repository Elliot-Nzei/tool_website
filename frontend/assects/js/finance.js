document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const salaryAmountInput = document.getElementById("salaryAmount");
  const saveAndProcessBtn = document.getElementById("saveAndProcessBtn");
  const currencySelect = document.getElementById("currencySelect");
  const currencySymbolSpan = document.getElementById("currencySymbol");
  const bankStatementFile = document.getElementById("bankStatementFile");
  const selectFileBtn = document.getElementById("selectFileBtn");
  const selectedFileNameSpan = document.getElementById("selectedFileName");
  const uploadStatusDiv = document.getElementById("uploadStatus");
  const financialSummarySection = document.querySelector(".financial-summary-section");

  // Summary Section Elements
  const totalIncomeSpan = document.getElementById("totalIncome");
  const totalExpensesSpan = document.getElementById("totalExpenses");
  const netSavingsSpan = document.getElementById("netSavings");
  const highestExpenseSpan = document.getElementById("highestExpense");
  const spendingChartCanvas = document.getElementById('spendingChart');
  const incomeExpenseChartCanvas = document.getElementById('incomeExpenseChart');
  const recurringExpensesList = document.getElementById("recurringExpensesList");
  const recentTransactionsList = document.getElementById("recentTransactionsList");

  const currencySymbols = { NGN: '₦', USD: '$', EUR: '€', GBP: '£' };
  let spendingChart, incomeExpenseChart;

  // --- DUMMY BACKEND RESPONSE (Simulation) ---
  const getDummyFinancialData = (currencySymbol) => ({
    "total_income": 500000.00,
    "total_expenses": 350000.00,
    "net_savings": 150000.00,
    "highest_expense": { "description": "Luxury Apartment Rent", "amount": 150000.00 },
    "spending_breakdown": {
      "Rent": 150000.00,
      "Food & Dining": 85000.00,
      "Transport": 45000.00,
      "Entertainment": 30000.00,
      "Utilities": 25000.00,
      "Miscellaneous": 15000.00
    },
    "recurring_transactions": [
      { "description": "Netflix Subscription", "amount": 15.99, "frequency": "Monthly" },
      { "description": "Spotify Premium", "amount": 10.99, "frequency": "Monthly" },
      { "description": "Gym Membership", "amount": 50.00, "frequency": "Monthly" }
    ],
    "transactions": [
      { "Date": "2025-07-15", "Description": "Salary Deposit", "Amount": 500000.00, "Category": "Income" },
      { "Date": "2025-07-14", "Description": "Luxury Apartment Rent", "Amount": -150000.00, "Category": "Rent" },
      { "Date": "2025-07-12", "Description": "Grocery Shopping", "Amount": -45000.00, "Category": "Food & Dining" },
      { "Date": "2025-07-10", "Description": "Uber Ride", "Amount": -125.50, "Category": "Transport" },
      { "Date": "2025-07-08", "Description": "Netflix Subscription", "Amount": -15.99, "Category": "Entertainment" }
    ]
  });

  // --- UI UPDATE FUNCTIONS ---

  const formatCurrency = (amount, symbol) => `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const updateUI = (data, currencySymbol) => {
    // Update metric cards
    totalIncomeSpan.textContent = formatCurrency(data.total_income, currencySymbol);
    totalExpensesSpan.textContent = formatCurrency(data.total_expenses, currencySymbol);
    netSavingsSpan.textContent = formatCurrency(data.net_savings, currencySymbol);
    highestExpenseSpan.textContent = `${formatCurrency(data.highest_expense.amount, currencySymbol)} (${data.highest_expense.description})`;

    // Populate lists
    populateList(recurringExpensesList, data.recurring_transactions, currencySymbol);
    populateList(recentTransactionsList, data.transactions, currencySymbol);

    // Create or update charts
    createOrUpdateCharts(data, currencySymbol);

    // Show the summary section
    if (financialSummarySection) financialSummarySection.style.display = 'block';
  };

  const populateList = (listElement, items, currencySymbol) => {
    if (!listElement) return;
    listElement.innerHTML = ''; // Clear existing items
    if (items.length === 0) {
      listElement.innerHTML = '<li>No data available.</li>';
      return;
    }
    items.forEach(item => {
      const li = document.createElement('li');
      const isExpense = item.Amount < 0 || item.frequency; // Recurring items are always expenses
      const amount = item.Amount ? item.Amount : -item.amount; // Normalize amount key
      li.innerHTML = `
        <div class="list-item-main">
          <span class="description">${item.Description || item.description}</span>
          <span class="date">${item.Date || item.frequency}</span>
        </div>
        <span class="amount ${isExpense ? 'expense' : 'income'}">${formatCurrency(Math.abs(amount), currencySymbol)}</span>
      `;
      listElement.appendChild(li);
    });
  };

  const createOrUpdateCharts = (data, currencySymbol) => {
    // Spending Breakdown Chart (Pie)
    if (spendingChartCanvas) {
      if (spendingChart) spendingChart.destroy();
      spendingChart = new Chart(spendingChartCanvas, {
        type: 'pie',
        data: {
          labels: Object.keys(data.spending_breakdown),
          datasets: [{
            data: Object.values(data.spending_breakdown),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }

    // Income vs. Expense Chart (Bar)
    if (incomeExpenseChartCanvas) {
      if (incomeExpenseChart) incomeExpenseChart.destroy();
      incomeExpenseChart = new Chart(incomeExpenseChartCanvas, {
        type: 'bar',
        data: {
          labels: ['Total Flow'],
          datasets: [
            { label: 'Income', data: [data.total_income], backgroundColor: '#28a745' },
            { label: 'Expenses', data: [data.total_expenses], backgroundColor: '#dc3545' }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
      });
    }
  };

  // --- EVENT HANDLERS ---

  const handleSaveAndProcess = () => {
    const salary = salaryAmountInput.value;
    const currency = currencySelect.value;
    localStorage.setItem('monthlySalary', salary);
    localStorage.setItem('currency', currency);

    if (!bankStatementFile.files.length) {
      window.showNotification('Please select a bank statement file.', 'error');
      return;
    }

    uploadStatusDiv.textContent = 'Processing statement...';
    uploadStatusDiv.style.color = '#17a2b8';

    // Simulate backend processing
    setTimeout(() => {
      const currencySymbol = currencySymbols[currency];
      const dummyData = getDummyFinancialData(currencySymbol);
      updateUI(dummyData, currencySymbol);
      uploadStatusDiv.textContent = 'Statement processed successfully!';
      uploadStatusDiv.style.color = '#28a745';
      window.showNotification('Financial summary updated!', 'success');
    }, 2000);
  };

  const loadSavedData = () => {
    const savedSalary = localStorage.getItem('monthlySalary');
    const savedCurrency = localStorage.getItem('currency') || 'NGN';
    if (savedSalary) salaryAmountInput.value = savedSalary;
    currencySelect.value = savedCurrency;
    currencySymbolSpan.textContent = currencySymbols[savedCurrency];
  };

  // --- EVENT LISTENERS ---

  if (currencySelect) {
    currencySelect.addEventListener('change', () => {
      const newCurrency = currencySelect.value;
      currencySymbolSpan.textContent = currencySymbols[newCurrency];
      localStorage.setItem('currency', newCurrency);
    });
  }

  if (saveAndProcessBtn) {
    saveAndProcessBtn.addEventListener('click', handleSaveAndProcess);
  }

  if (selectFileBtn) {
    selectFileBtn.addEventListener('click', () => bankStatementFile.click());
    bankStatementFile.addEventListener('change', () => {
      selectedFileNameSpan.textContent = bankStatementFile.files.length > 0
        ? bankStatementFile.files[0].name
        : 'No file chosen';
    });
  }

  // --- INITIALIZATION ---
  loadSavedData();
});