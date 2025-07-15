document.addEventListener('DOMContentLoaded', () => {
  // Finance Page Logic
  const salaryAmountInput = document.getElementById("salaryAmount");
  const saveSalaryBtn = document.getElementById("saveSalaryBtn");
  const currencySelect = document.getElementById("currencySelect");
  const currencySymbolSpan = document.getElementById("currencySymbol");
  const bankStatementFile = document.getElementById("bankStatementFile");
  const selectFileBtn = document.getElementById("selectFileBtn");
  const selectedFileNameSpan = document.getElementById("selectedFileName");
  const processStatementBtn = document.getElementById("processStatementBtn");
  const uploadStatusDiv = document.getElementById("uploadStatus");
  const financialSummarySection = document.querySelector(".financial-summary-section");
  const totalIncomeSpan = document.getElementById("totalIncome");
  const totalExpensesSpan = document.getElementById("totalExpenses");
  const netSavingsSpan = document.getElementById("netSavings");
  const highestExpenseSpan = document.getElementById("highestExpense");
  const spendingCategoriesList = document.getElementById("spendingCategoriesList");
  const spendingChartCanvas = document.getElementById('spendingChart');
  const incomeExpenseChartCanvas = document.getElementById('incomeExpenseChart');

  // Currency symbols mapping
  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  // Load saved salary and currency
  if (salaryAmountInput && currencySelect && currencySymbolSpan) {
    const savedSalary = localStorage.getItem('monthlySalary');
    const savedCurrency = localStorage.getItem('currency');

    if (savedSalary) {
      salaryAmountInput.value = savedSalary;
    }
    if (savedCurrency) {
      currencySelect.value = savedCurrency;
      currencySymbolSpan.textContent = currencySymbols[savedCurrency];
    } else {
      // Default to NGN if no currency saved
      currencySelect.value = 'NGN';
      currencySymbolSpan.textContent = currencySymbols['NGN'];
    }

    currencySelect.addEventListener('change', () => {
      currencySymbolSpan.textContent = currencySymbols[currencySelect.value];
      localStorage.setItem('currency', currencySelect.value);
    });

    if (saveSalaryBtn) {
      saveSalaryBtn.addEventListener('click', () => {
        localStorage.setItem('monthlySalary', salaryAmountInput.value);
        localStorage.setItem('currency', currencySelect.value);
        window.showNotification(`Monthly salary of ${currencySymbols[currencySelect.value]}${salaryAmountInput.value} saved!`, 'success');
      });
    }
  }

  // Handle file selection
  if (selectFileBtn && bankStatementFile && selectedFileNameSpan) {
    selectFileBtn.addEventListener('click', () => {
      bankStatementFile.click();
    });

    bankStatementFile.addEventListener('change', () => {
      if (bankStatementFile.files.length > 0) {
        selectedFileNameSpan.textContent = bankStatementFile.files[0].name;
      } else {
        selectedFileNameSpan.textContent = 'No file chosen';
      }
    });
  }

  // Process statement (placeholder for backend integration)
  if (processStatementBtn && uploadStatusDiv) {
    processStatementBtn.addEventListener('click', () => {
      if (bankStatementFile && bankStatementFile.files.length > 0) {
        uploadStatusDiv.textContent = 'Processing statement... (Backend integration needed)';
        uploadStatusDiv.style.color = '#3498db'; // Blue for processing
        // Simulate processing
        setTimeout(() => {
          uploadStatusDiv.textContent = 'Statement processed! (Dummy data shown)';
          uploadStatusDiv.style.color = '#28a745'; // Green for success
          // Display dummy financial summary
          if (financialSummarySection) financialSummarySection.style.display = 'block';
          const currentCurrencySymbol = currencySymbols[currencySelect.value];

          if (totalIncomeSpan) totalIncomeSpan.textContent = `${currentCurrencySymbol}500,000.00`;
          if (totalExpensesSpan) totalExpensesSpan.textContent = `${currentCurrencySymbol}350,000.00`;
          if (netSavingsSpan) netSavingsSpan.textContent = `${currentCurrencySymbol}150,000.00`;
          if (highestExpenseSpan) highestExpenseSpan.textContent = `${currentCurrencySymbol}120,000.00 (Groceries)`;

          if (spendingCategoriesList) {
            spendingCategoriesList.innerHTML = `
              <li>Food <span>${currentCurrencySymbol}100,000</span></li>
              <li>Transport <span>${currentCurrencySymbol}50,000</span></li>
              <li>Rent <span>${currentCurrencySymbol}150,000</span></li>
              <li>Utilities <span>${currentCurrencySymbol}30,000</span></li>
            `;
          }

          // Dummy data for charts
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
              data: [500000, 350000],
              backgroundColor: ['#28a745', '#dc3545'],
            }]
          };

          if (spendingChartCanvas) {
            new Chart(spendingChartCanvas, {
              type: 'pie',
              data: spendingData,
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Spending Breakdown'
                  }
                }
              },
            });
          }

          if (incomeExpenseChartCanvas) {
            new Chart(incomeExpenseChartCanvas, {
              type: 'bar',
              data: incomeExpenseData,
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: 'Income vs. Expenses'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              },
            });
          }

        }, 2000);
      } else {
        uploadStatusDiv.textContent = 'Please select a file to upload.';
        uploadStatusDiv.style.color = '#e74c3c'; // Red for error
        window.showNotification('Please select a file to upload.', 'error');
      }
    });
  }
});