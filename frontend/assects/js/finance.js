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
  const viewHistoryBtn = document.getElementById("viewHistoryBtn");
  const financialHistoryListSection = document.getElementById("financialHistoryListSection");
  const financialHistoryList = document.getElementById("financialHistoryList");

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

    // Show the summary section and hide history list
    financialSummarySection.style.display = 'block';
    financialHistoryListSection.style.display = 'none';
    viewHistoryBtn.textContent = 'Hide Financial History';
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

  // --- HISTORY MANAGEMENT ---

  const getFinancialHistory = () => {
    const history = localStorage.getItem('financialAnalysesHistory');
    return history ? JSON.parse(history) : [];
  };

  const saveFinancialAnalysis = (analysis) => {
    const history = getFinancialHistory();
    history.push(analysis);
    localStorage.setItem('financialAnalysesHistory', JSON.stringify(history));
  };

  const populateHistoryList = () => {
    const history = getFinancialHistory();
    financialHistoryList.innerHTML = ''; // Clear existing list

    if (history.length === 0) {
      financialHistoryList.innerHTML = '<li>No saved analyses yet.</li>';
      return;
    }

    history.forEach((entry, index) => {
      const li = document.createElement('li');
      li.classList.add('history-item');
      li.dataset.index = index; // Store index for easy retrieval
      li.textContent = `Analysis from ${new Date(entry.timestamp).toLocaleString()} (${currencySymbols[entry.currency]})`;
      financialHistoryList.appendChild(li);
    });
  };

  const loadSpecificAnalysis = (index) => {
    const history = getFinancialHistory();
    if (index >= 0 && index < history.length) {
      const entry = history[index];
      updateUI(entry.data, currencySymbols[entry.currency]);
    } else {
      window.showNotification('Error: Analysis not found.', 'error');
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

      const newAnalysis = {
        id: Date.now(), // Unique ID
        timestamp: new Date().toISOString(),
        currency: currency,
        data: dummyData
      };
      saveFinancialAnalysis(newAnalysis);

      updateUI(dummyData, currencySymbol);
      uploadStatusDiv.textContent = 'Statement processed successfully!';
      uploadStatusDiv.style.color = '#28a745';
      window.showNotification('Financial summary updated and saved!', 'success');

      viewHistoryBtn.style.display = 'block'; // Ensure history button is visible
    }, 2000);
  };

  const handleViewHistoryClick = () => {
    if (financialHistoryListSection.style.display === 'block') {
      // If history is visible, hide it and show summary if one is loaded
      financialHistoryListSection.style.display = 'none';
      if (financialSummarySection.style.display === 'block') {
        viewHistoryBtn.textContent = 'Hide Financial History';
      } else {
        viewHistoryBtn.textContent = 'View Financial History';
      }
    } else {
      // If history is hidden, show it and hide summary
      financialSummarySection.style.display = 'none';
      financialHistoryListSection.style.display = 'block';
      populateHistoryList();
      viewHistoryBtn.textContent = 'Hide Financial History';
    }
  };

  // --- INITIALIZATION ---
  const initializeFinancePage = () => {
    const savedSalary = localStorage.getItem('monthlySalary');
    const savedCurrency = localStorage.getItem('currency') || 'NGN';
    if (salaryAmountInput) salaryAmountInput.value = savedSalary;
    if (currencySelect) currencySelect.value = savedCurrency;
    if (currencySymbolSpan) currencySymbolSpan.textContent = currencySymbols[savedCurrency];

    // Check if there's any history to show the button
    if (getFinancialHistory().length > 0) {
      viewHistoryBtn.style.display = 'block';
    }

    // Add event listener for history items
    financialHistoryList.addEventListener('click', (event) => {
      if (event.target.classList.contains('history-item')) {
        const index = parseInt(event.target.dataset.index);
        loadSpecificAnalysis(index);
      }
    });
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

  if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener('click', handleViewHistoryClick);
  }

  initializeFinancePage();
});