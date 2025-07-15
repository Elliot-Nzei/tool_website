document.addEventListener('DOMContentLoaded', () => {
  // --- Language Translation Data ---
  const translations = {
    en: {
      toolMaster: "ToolMaster",
      notifications: "Notifications",
      dashboard: "Dashboard",
      resumes: "Resumes",
      finances: "Finances",
      healthScore: "Health Score",
      images: "Images",
      pending: "Pending",
      quickActions: "Quick Actions",
      buildResume: "Build Resume",
      trackFinance: "Track Finance",
      logHealth: "Log Health",
      uploadImages: "Upload Images",
      analysisImprovement: "Analysis & Improvement",
      resumeScore: "Resume Score",
      suggestionActionVerbs: "Suggestion: Add more action verbs to your experience section.",
      improveNow: "Improve Now",
      savingsRate: "Savings Rate",
      suggestionCategorizeSpending: "Suggestion: Categorize your spending to find potential savings.",
      analyzeSpending: "Analyze Spending",
      imageProjects: "Image Projects",
      name: "Name",
      status: "Status",
      lastModified: "Last Modified",
      home: "Home",
      account: "Account",
      accountSettings: "Account Settings",
      uploadNewPhoto: "Upload New Photo",
      preferences: "Preferences",
      darkMode: "Dark Mode",
      language: "Language",
      helpSupport: "Help & Support",
      contactUs: "Contact Us",
      aboutThisApp: "About This App",
      save: "Save",
      cancel: "Cancel",
      changePassword: "Change Password",
      financeDashboard: "Finance Dashboard",
      financeDashboardTitle: "Your Financial Overview",
      monthlySalary: "Monthly Salary",
      enterSalary: "Enter your net monthly salary:",
      saveSalary: "Save Salary",
      bankStatementUpload: "Bank Statement Upload",
      uploadInstructions: "Upload your bank statement (CSV or PDF recommended):",
      processStatement: "Process Statement",
      financialSummary: "Financial Summary",
      totalIncome: "Total Income:",
      totalExpenses: "Total Expenses:",
      spendingCategories: "Spending Categories",
      addModule: "Add Module",
      chooseModule: "Choose a Module",
      resumeModule: "Resume",
      resumeModuleDesc: "Create and manage your professional resumes.",
      financeModule: "Finance",
      financeModuleDesc: "Track your income, expenses, and budgets.",
      healthModule: "Health",
      healthModuleDesc: "Monitor your health metrics and fitness goals.",
      imageModule: "Image",
      imageModuleDesc: "Manage and process your image collections.",
      launch: "Launch",
      selectFile: "Select File"
    },
    yo: {
      toolMaster: "ToolMaster",
      notifications: "Awọn iwifunni",
      dashboard: "Dasibodu",
      resumes: "Awọn Iwe-ẹri",
      finances: "Isuna",
      healthScore: "Oṣuwọn Ilera",
      images: "Awọn aworan",
      pending: "Ni isunmọtosi",
      quickActions: "Awọn iṣe iyara",
      buildResume: "Kọ Iwe-ẹri",
      trackFinance: "Tọpinpin Isuna",
      logHealth: "Ṣe igbasilẹ Ilera",
      uploadImages: "Po Awọn aworan si",
      analysisImprovement: "Onínọmbà & Ilọsiwaju",
      resumeScore: "Oṣuwọn Iwe-ẹri",
      suggestionActionVerbs: "Imọran: Fi awọn ọrọ-iṣe diẹ sii kun apakan iriri rẹ.",
      improveNow: "Ṣe ilọsiwaju Bayi",
      savingsRate: "Oṣuwọn Ifowopamọ",
      suggestionCategorizeSpending: "Imọran: Pinpin inawo rẹ lati wa awọn ifowopamọ ti o pọju.",
      analyzeSpending: "Ṣe itupalẹ Inawo",
      imageProjects: "Awọn iṣẹ akanṣe aworan",
      name: "Orukọ",
      status: "Ipo",
      lastModified: "Ti yipada kẹhin",
      home: "Ile",
      account: "Akọọlẹ",
      accountSettings: "Eto Akọọlẹ",
      uploadNewPhoto: "Po Fọto Tuntun si",
      preferences: "Awọn ayanfẹ",
      darkMode: "Ipo Dudu",
      language: "Ede",
      helpSupport: "Iranlọwọ & Atilẹyin",
      contactUs: "Kan si Wa",
      aboutThisApp: "Nipa Ohun elo yii",
      save: "Fipamọ",
      cancel: "Fagilee",
      changePassword: "Yi Ọrọigbaniwọle pada",
      financeDashboard: "Dasibodu Isuna",
      financeDashboardTitle: "Akopọ Isuna Rẹ",
      monthlySalary: "Oṣu Oṣooṣu",
      enterSalary: "Tẹ owo oṣooṣu rẹ sii:",
      saveSalary: "Fipamọ Oṣooṣu",
      bankStatementUpload: "Ikọsilẹ Banki",
      uploadInstructions: "Po alaye banki rẹ si (CSV tabi PDF ni a gbaniyanju):",
      processStatement: "Ṣe ilana Alaye",
      financialSummary: "Akopọ Isuna",
      totalIncome: "Apapọ Owo-wiwọle:",
      totalExpenses: "Apapọ Awọn inawo:",
      spendingCategories: "Awọn ẹka inawo",
      addModule: "Fi Module kun",
      chooseModule: "Yan Module kan",
      resumeModule: "Iwe-ẹri",
      resumeModuleDesc: "Ṣẹda ati ṣakoso awọn iwe-ẹri ọjọgbọn rẹ.",
      financeModule: "Isuna",
      financeModuleDesc: "Tọpinpin owo-wiwọle rẹ, awọn inawo, ati awọn isuna.",
      healthModule: "Ilera",
      healthModuleDesc: "Ṣe abojuto awọn metiriki ilera rẹ ati awọn ibi-afẹde amọdaju.",
      imageModule: "Aworan",
      imageModuleDesc: "Ṣakoso ati ṣe ilana awọn ikojọpọ aworan rẹ.",
      launch: "Ifilọlẹ",
      selectFile: "Yan Faili"
    },
    fr: {
      toolMaster: "ToolMaster",
      notifications: "Notifications",
      dashboard: "Tableau de bord",
      resumes: "CV",
      finances: "Finances",
      healthScore: "Score de Santé",
      images: "Images",
      pending: "En attente",
      quickActions: "Actions rapides",
      buildResume: "Créer un CV",
      trackFinance: "Suivre les finances",
      logHealth: "Enregistrer la santé",
      uploadImages: "Télécharger des images",
      analysisImprovement: "Analyse et Amélioration",
      resumeScore: "Score du CV",
      suggestionActionVerbs: "Suggestion: Ajoutez plus de verbes d'action à votre section expérience.",
      improveNow: "Améliorer maintenant",
      savingsRate: "Taux d'épargne",
      suggestionCategorizeSpending: "Suggestion: Classez vos dépenses pour trouver des économies potentielles.",
      analyzeSpending: "Analyser les dépenses",
      imageProjects: "Projets d'images",
      name: "Nom",
      status: "Statut",
      lastModified: "Dernière modification",
      home: "Accueil",
      account: "Compte",
      accountSettings: "Paramètres du compte",
      uploadNewPhoto: "Télécharger une nouvelle photo",
      preferences: "Préférences",
      darkMode: "Mode Sombre",
      language: "Langue",
      helpSupport: "Aide et Support",
      contactUs: "Nous contacter",
      aboutThisApp: "À propos de cette application",
      save: "Enregistrer",
      cancel: "Annuler",
      changePassword: "Changer le mot de passe",
      financeDashboard: "Tableau de bord financier",
      financeDashboardTitle: "Votre aperçu financier",
      monthlySalary: "Salaire mensuel",
      enterSalary: "Entrez votre salaire mensuel net:",
      saveSalary: "Enregistrer le salaire",
      bankStatementUpload: "Téléchargement de relevé bancaire",
      uploadInstructions: "Téléchargez votre relevé bancaire (CSV ou PDF recommandé):",
      processStatement: "Traiter le relevé",
      financialSummary: "Résumé financier",
      totalIncome: "Revenu total:",
      totalExpenses: "Dépenses totales:",
      spendingCategories: "Catégories de dépenses",
      addModule: "Ajouter un module",
      chooseModule: "Choisissez un module",
      resumeModule: "CV",
      resumeModuleDesc: "Créez et gérez vos CV professionnels.",
      financeModule: "Finances",
      financeModuleDesc: "Suivez vos revenus, dépenses et budgets.",
      healthModule: "Santé",
      healthModuleDesc: "Surveillez vos indicateurs de santé et vos objectifs de remise en forme.",
      imageModule: "Image",
      imageModuleDesc: "Gérez et traitez vos collections d'images.",
      launch: "Lancer",
      selectFile: "Sélectionner un fichier"
    }
  };

  const applyLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    // Update page title
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
      const titleKey = pageTitle.getAttribute('data-i18n-title');
      if (translations[lang] && translations[lang][titleKey]) {
        pageTitle.textContent = translations[lang][titleKey];
      }
    }
  };

  // Set initial language from localStorage or default to 'en'
  let currentLanguage = localStorage.getItem('language') || 'en';
  applyLanguage(currentLanguage);

  // Update the language select dropdown
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = currentLanguage;
    langSelect.addEventListener('change', (e) => {
      currentLanguage = e.target.value;
      localStorage.setItem('language', currentLanguage);
      applyLanguage(currentLanguage);
    });
  }

  const darkToggleButton = document.getElementById("darkToggle");
  const themeToggle = document.getElementById("themeToggle");
  const tabPlusButton = document.getElementById("tabPlus");

  // Function to apply the dark mode state
  const applyDarkMode = (isDark) => {
    document.body.classList.toggle("dark-mode", isDark);
    const darkToggleIcon = darkToggleButton ? darkToggleButton.querySelector("i") : null;
    if (darkToggleIcon) {
      if (isDark) {
        darkToggleIcon.classList.remove("fa-moon");
        darkToggleIcon.classList.add("fa-sun");
      } else {
        darkToggleIcon.classList.remove("fa-sun");
        darkToggleIcon.classList.add("fa-moon");
      }
    }
    if (themeToggle) {
      themeToggle.checked = isDark;
    }
  };

  // Check for saved dark mode preference and apply on load
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  applyDarkMode(savedDarkMode);

  // Event listener for the main dark mode toggle button
  if (darkToggleButton) {
    darkToggleButton.addEventListener("click", () => {
      const isDarkMode = !document.body.classList.contains("dark-mode");
      localStorage.setItem('darkMode', isDarkMode);
      applyDarkMode(isDarkMode);
    });
  }

  // Event listener for the theme toggle on the account page
  if (themeToggle) {
    themeToggle.addEventListener("change", (e) => {
      const isDarkMode = e.target.checked;
      localStorage.setItem('darkMode', isDarkMode);
      applyDarkMode(isDarkMode);
    });
  }

  // Event listener for the module launcher button
  if (document.getElementById("moduleBtn")) {
    document.getElementById("moduleBtn").addEventListener("click", () => {
      window.location.href = 'add_module.html';
    });
  }

  // Event listener for the tab plus button
  if (tabPlusButton) {
    tabPlusButton.addEventListener("click", () => {
      window.location.href = 'add_module.html';
    });
  }

  // Event listener for module cards on add_module.html
  const financeModuleCard = document.getElementById("financeModuleCard");
  if (financeModuleCard) {
    financeModuleCard.addEventListener("click", () => {
      window.location.href = 'finance.html';
    });
  }

  // Photo upload logic for account page
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
  const photoUploadInput = document.getElementById("photoUpload");
  const profileImage = document.getElementById("profileImage");

  // Load saved profile image from localStorage on page load
  const savedProfileImage = localStorage.getItem('profileImage');
  if (savedProfileImage && profileImage) {
    profileImage.src = savedProfileImage;
  }

  if (uploadPhotoBtn && photoUploadInput && profileImage) {
    uploadPhotoBtn.addEventListener("click", () => {
      photoUploadInput.click();
    });

    photoUploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profileImage.src = e.target.result;
          localStorage.setItem('profileImage', e.target.result); // Save image to localStorage
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Profile Edit Logic
  const displayName = document.getElementById("displayName");
  const displayEmail = document.getElementById("displayEmail");
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const editButtons = document.querySelectorAll(".edit-btn");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const profileActions = document.querySelector(".profile-actions");

  let originalName = displayName ? displayName.textContent : '';
  let originalEmail = displayEmail ? displayEmail.textContent : '';

  // Load saved profile data from localStorage on page load
  const savedName = localStorage.getItem('userName');
  const savedEmail = localStorage.getItem('userEmail');

  if (savedName && displayName && nameInput) {
    displayName.textContent = savedName;
    nameInput.value = savedName;
    originalName = savedName;
  }
  if (savedEmail && displayEmail && emailInput) {
    displayEmail.textContent = savedEmail;
    emailInput.value = savedEmail;
    originalEmail = savedEmail;
  }

  // Function to toggle visibility of display text and input field for a specific field
  const toggleFieldEditMode = (field, isEditing) => {
    if (field === "name") {
      if (displayName) displayName.style.display = isEditing ? "none" : "block";
      if (nameInput) nameInput.style.display = isEditing ? "block" : "none";
      if (isEditing && nameInput) nameInput.focus();
    } else if (field === "email") {
      if (displayEmail) displayEmail.style.display = isEditing ? "none" : "block";
      if (emailInput) emailInput.style.display = isEditing ? "block" : "none";
      if (isEditing && emailInput) emailInput.focus();
    }
  };

  // Initialize profile fields to display mode on load
  if (displayName && nameInput) toggleFieldEditMode("name", false);
  if (displayEmail && emailInput) toggleFieldEditMode("email", false);
  if (profileActions) profileActions.style.display = "none";

  editButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const field = e.currentTarget.dataset.field;
      toggleFieldEditMode(field, true);
      if (profileActions) profileActions.style.display = "flex";
    });
  });

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      if (displayName && nameInput) {
        displayName.textContent = nameInput.value;
        localStorage.setItem('userName', nameInput.value);
      }
      if (displayEmail && emailInput) {
        displayEmail.textContent = emailInput.value;
        localStorage.setItem('userEmail', emailInput.value);
      }
      originalName = nameInput ? nameInput.value : originalName;
      originalEmail = emailInput ? emailInput.value : originalEmail;
      toggleFieldEditMode("name", false);
      toggleFieldEditMode("email", false);
      if (profileActions) profileActions.style.display = "none";
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      if (nameInput) nameInput.value = originalName;
      if (emailInput) emailInput.value = originalEmail;
      toggleFieldEditMode("name", false);
      toggleFieldEditMode("email", false);
      if (profileActions) profileActions.style.display = "none";
    });
  }
});

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
const spendingCategoriesList = document.getElementById("spendingCategoriesList");

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
      alert('Monthly salary and currency saved!');
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
        if (totalIncomeSpan) totalIncomeSpan.textContent = `${currencySymbols[currencySelect.value]}500,000.00`;
        if (totalExpensesSpan) totalExpensesSpan.textContent = `${currencySymbols[currencySelect.value]}350,000.00`;
        if (spendingCategoriesList) {
          spendingCategoriesList.innerHTML = `
            <li>Food <span>${currencySymbols[currencySelect.value]}100,000</span></li>
            <li>Transport <span>${currencySymbols[currencySelect.value]}50,000</span></li>
            <li>Rent <span>${currencySymbols[currencySelect.value]}150,000</span></li>
            <li>Utilities <span>${currencySymbols[currencySelect.value]}30,000</span></li>
          `;
        }
      }, 2000);
    } else {
      uploadStatusDiv.textContent = 'Please select a file to upload.';
      uploadStatusDiv.style.color = '#e74c3c'; // Red for error
    }
  });
}
