document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const salaryAmountInput = document.getElementById("salaryAmount");
  const saveAndProcessBtn = document.getElementById("saveAndProcessBtn");
  const currencySelect = document.getElementById("currencySelect");
  const currencySymbolSpan = document.getElementById("currencySymbol");
  const bankStatementFile = document.getElementById("bankStatementFile");
  const selectFileBtn = document.getElementById("selectFileBtn");
  const selectedFileNameSpan = document.getElementById("selectedFileName");
  const uploadStatusDiv = document.getElementById("uploadStatus");
  const financialSummarySection = document.querySelector(".financial-summary-section");
  const totalIncomeSpan = document.getElementById("totalIncome");
  const totalExpensesSpan = document.getElementById("totalExpenses");
  const netSavingsSpan = document.getElementById("netSavings");
  const highestExpenseSpan = document.getElementById("highestExpense");
  const spendingCategoriesList = document.getElementById("spendingCategoriesList");
  const recentTransactionsList = document.getElementById("recentTransactionsList");
  const spendingChartCanvas = document.getElementById('spendingChart');
  const incomeExpenseChartCanvas = document.getElementById('incomeExpenseChart');

  // Currency symbols mapping
  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  let spendingChart, incomeExpenseChart;

  // --- FUNCTIONS ---

  /**
   * Updates the financial summary section with dummy data.
   * @param {string} currencySymbol - The currency symbol to use.
   */
  const updateFinancialSummary = (currencySymbol) => {
    if (financialSummarySection) financialSummarySection.style.display = 'block';

    const summaryData = {
      income: 500000,
      expenses: 350000,
      savings: 150000,
      highestExpense: 120000,
      highestExpenseCategory: "Groceries"
    };

    if (totalIncomeSpan) totalIncomeSpan.textContent = `${currencySymbol}${summaryData.income.toLocaleString()}`;
    if (totalExpensesSpan) totalExpensesSpan.textContent = `${currencySymbol}${summaryData.expenses.toLocaleString()}`;
    if (netSavingsSpan) netSavingsSpan.textContent = `${currencySymbol}${summaryData.savings.toLocaleString()}`;
    if (highestExpenseSpan) highestExpenseSpan.textContent = `${currencySymbol}${summaryData.highestExpense.toLocaleString()} (${summaryData.highestExpenseCategory})`;

    updateTransactionList(currencySymbol);
    updateSpendingCategories(currencySymbol);
    createOrUpdateCharts(currencySymbol, summaryData);
  };

  /**
   * Updates the recent transactions list with dummy data.
   * @param {string} currencySymbol - The currency symbol to use.
   */
  const updateTransactionList = (currencySymbol) => {
    if (recentTransactionsList) {
      recentTransactionsList.innerHTML = `
        <li><span class="transaction-date">2024-07-10</span> - <span class="transaction-description">Groceries</span>: <span class="transaction-amount">${currencySymbol}120,000</span></li>
        <li><span class="transaction-date">2024-07-08</span> - <span class="transaction-description">Electricity Bill</span>: <span class="transaction-amount">${currencySymbol}15,000</span></li>
        <li><span class="transaction-date">2024-07-05</span> - <span class="transaction-description">Salary</span>: <span class="transaction-amount">${currencySymbol}500,000</span></li>
      `;
    }
  };

  /**
   * Updates the spending categories list with dummy data.
   * @param {string} currencySymbol - The currency symbol to use.
   */
  const updateSpendingCategories = (currencySymbol) => {
    if (spendingCategoriesList) {
      spendingCategoriesList.innerHTML = `
        <li>Food <span>${currencySymbol}100,000</span></li>
        <li>Transport <span>${currencySymbol}50,000</span></li>
        <li>Rent <span>${currencySymbol}150,000</span></li>
        <li>Utilities <span>${currencySymbol}30,000</span></li>
      `;
    }
  };

  /**
   * Creates or updates the financial charts.
   * @param {string} currencySymbol - The currency symbol to use.
   * @param {object} summaryData - The financial summary data.
   */
  const createOrUpdateCharts = (currencySymbol, summaryData) => {
    const spendingData = {
      labels: ['Food', 'Transport', 'Rent', 'Utilities'],
      datasets: [{
        data: [100000, 50000, 150000, 30000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      }]
    };

    const incomeExpenseData = {
      labels: ['Income', 'Expenses'],
      datasets: [{
        data: [summaryData.income, summaryData.expenses],
        backgroundColor: ['#28a745', '#dc3545'],
      }]
    };

    if (spendingChartCanvas) {
      if (spendingChart) spendingChart.destroy();
      spendingChart = new Chart(spendingChartCanvas, {
        type: 'pie',
        data: spendingData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Spending Breakdown' }
          }
        },
      });
    }

    if (incomeExpenseChartCanvas) {
      if (incomeExpenseChart) incomeExpenseChart.destroy();
      incomeExpenseChart = new Chart(incomeExpenseChartCanvas, {
        type: 'bar',
        data: incomeExpenseData,
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income vs. Expenses' }
          },
          scales: { y: { beginAtZero: true } }
        },
      });
    }
  };

  /**
   * Loads saved salary and currency from localStorage.
   */
  const loadSavedData = () => {
    if (!salaryAmountInput || !currencySelect || !currencySymbolSpan) return;

    const savedSalary = localStorage.getItem('monthlySalary');
    const savedCurrency = localStorage.getItem('currency') || 'NGN'; // Default to NGN

    if (savedSalary) {
      salaryAmountInput.value = savedSalary;
    }
    currencySelect.value = savedCurrency;
    currencySymbolSpan.textContent = currencySymbols[savedCurrency];
  };

  /**
   * Handles the main "Save & Process" button click event.
   */
  const handleSaveAndProcess = () => {
    // Save salary and currency
    const salary = salaryAmountInput.value;
    const currency = currencySelect.value;
    localStorage.setItem('monthlySalary', salary);
    localStorage.setItem('currency', currency);
    window.showNotification(`Monthly salary of ${currencySymbols[currency]}${salary} saved!`, 'success');

    // Process statement if a file is selected
    if (bankStatementFile && bankStatementFile.files.length > 0) {
      uploadStatusDiv.textContent = 'Processing statement... (Backend integration needed)';
      uploadStatusDiv.style.color = '#3498db'; // Blue for processing

      // Simulate processing
      setTimeout(() => {
        uploadStatusDiv.textContent = 'Statement processed! (Dummy data shown)';
        uploadStatusDiv.style.color = '#28a745'; // Green for success
        updateFinancialSummary(currencySymbols[currency]);
      }, 2000);
    } else {
      uploadStatusDiv.textContent = 'Please select a file to upload.';
      uploadStatusDiv.style.color = '#e74c3c'; // Red for error
      window.showNotification('Please select a file to upload.', 'error');
    }
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

  if (selectFileBtn && bankStatementFile) {
    selectFileBtn.addEventListener('click', () => bankStatementFile.click());

    bankStatementFile.addEventListener('change', () => {
      if (selectedFileNameSpan) {
        selectedFileNameSpan.textContent = bankStatementFile.files.length > 0
          ? bankStatementFile.files[0].name
          : 'No file chosen';
      }
    });
  }

  // --- INITIALIZATION ---
  loadSavedData();
});
