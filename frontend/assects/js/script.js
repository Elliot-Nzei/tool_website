document.addEventListener('DOMContentLoaded', () => {
  // --- TRANSLATIONS ---
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
      uploadInstructions: "Upload your bank statement (CSV, Excel, or PDF recommended):",
      processStatement: "Process Statement",
      financialSummary: "Financial Summary",
      totalIncome: "Total Income:",
      totalExpenses: "Total Expenses:",
      spendingCategories: "Spending Categories",
      spendingBreakdownList: "Spending Breakdown"
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
      selectFile: "Yan Faili",
      netSavings: "Ifowopamọ Apapọ",
      highestExpense: "Inawo ti o ga julọ",
      recurringExpenses: "Awọn inawo loorekoore",
      incomeVsExpenses: "Owo-wiwọle vs. Awọn inawo"
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
      financeSetup: "Configurez vos finances",
      financeDashboardTitle: "Votre aperçu financier",
      monthlySalary: "Salaire mensuel",
      enterSalary: "Entrez votre salaire mensuel net:",
      saveSalary: "Enregistrer le salaire",
      saveAndProcess: "Enregistrer et traiter",
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
      selectFile: "Sélectionner un fichier",
      netSavings: "Épargne nette",
      highestExpense: "Dépense la plus élevée",
      recurringExpenses: "Dépenses récurrentes",
      incomeVsExpenses: "Revenus vs Dépenses",
      recentTransactions: "Transactions récentes"
    }
  };

  // --- DOM Elements ---
  const langSelect = document.getElementById('langSelect');
  const darkToggleButton = document.getElementById("darkToggle");
  const themeToggle = document.getElementById("themeToggle");
  const tabPlusButton = document.getElementById("tabPlus");
  const moduleBtn = document.getElementById("moduleBtn");
  const financeModuleCard = document.getElementById("financeModuleCard");
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
  const photoUploadInput = document.getElementById("photoUpload");
  const profileImage = document.getElementById("profileImage");
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

  // --- FUNCTIONS ---

  /**
   * Applies the selected language to the UI.
   * @param {string} lang - The language code (e.g., 'en', 'yo', 'fr').
   */
  const applyLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
      const titleKey = pageTitle.getAttribute('data-i18n-title');
      if (translations[lang] && translations[lang][titleKey]) {
        pageTitle.textContent = translations[lang][titleKey];
      }
    }
  };

  /**
   * Applies the dark mode state to the UI.
   * @param {boolean} isDark - Whether dark mode is enabled.
   */
  const applyDarkMode = (isDark) => {
    document.body.classList.toggle("dark-mode", isDark);
    const darkToggleIcon = darkToggleButton ? darkToggleButton.querySelector("i") : null;
    if (darkToggleIcon) {
      darkToggleIcon.classList.toggle("fa-sun", isDark);
      darkToggleIcon.classList.toggle("fa-moon", !isDark);
    }
    if (themeToggle) {
      themeToggle.checked = isDark;
    }
  };

  /**
   * Initializes the language settings.
   */
  const initializeLanguage = () => {
    let currentLanguage = localStorage.getItem('language') || 'en';
    applyLanguage(currentLanguage);
    if (langSelect) {
      langSelect.value = currentLanguage;
    }
  };

  /**
   * Initializes the dark mode settings.
   */
  const initializeDarkMode = () => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    applyDarkMode(savedDarkMode);
  };

  /**
   * Initializes the profile fields and loads data from localStorage.
   */
  const initializeProfile = () => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedProfileImage = localStorage.getItem('profileImage');

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
    if (savedProfileImage && profileImage) {
      profileImage.src = savedProfileImage;
    }

    toggleFieldEditMode("name", false);
    toggleFieldEditMode("email", false);
    if (profileActions) profileActions.style.display = "none";
  };

  /**
   * Toggles the edit mode for a profile field.
   * @param {string} field - The field to toggle ('name' or 'email').
   * @param {boolean} isEditing - Whether to enable edit mode.
   */
  const toggleFieldEditMode = (field, isEditing) => {
    const displayEl = field === "name" ? displayName : displayEmail;
    const inputEl = field === "name" ? nameInput : emailInput;

    if (displayEl) displayEl.style.display = isEditing ? "none" : "block";
    if (inputEl) inputEl.style.display = isEditing ? "block" : "none";
    if (isEditing && inputEl) inputEl.focus();
  };

  // --- EVENT LISTENERS ---

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const newLanguage = e.target.value;
      localStorage.setItem('language', newLanguage);
      applyLanguage(newLanguage);
    });
  }

  if (darkToggleButton) {
    darkToggleButton.addEventListener("click", () => {
      const isDarkMode = !document.body.classList.contains("dark-mode");
      localStorage.setItem('darkMode', isDarkMode);
      applyDarkMode(isDarkMode);
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", (e) => {
      const isDarkMode = e.target.checked;
      localStorage.setItem('darkMode', isDarkMode);
      applyDarkMode(isDarkMode);
    });
  }

  const setupRedirect = (element, url, message) => {
    if (element) {
      element.addEventListener("click", () => {
        if (message) {
          window.showNotification(message, 'success');
        }
        setTimeout(() => { window.location.href = url; }, 500);
      });
    }
  };

  setupRedirect(moduleBtn, 'add_module.html', 'Initiating modules...');
  setupRedirect(tabPlusButton, 'add_module.html', 'Initiating modules...');
  setupRedirect(financeModuleCard, 'finance.html');

  if (uploadPhotoBtn && photoUploadInput) {
    uploadPhotoBtn.addEventListener("click", () => photoUploadInput.click());

    photoUploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file && profileImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profileImage.src = e.target.result;
          localStorage.setItem('profileImage', e.target.result);
          window.showNotification('Profile image updated!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }

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
        const newName = nameInput.value;
        displayName.textContent = newName;
        localStorage.setItem('userName', newName);
        originalName = newName;
      }
      if (displayEmail && emailInput) {
        const newEmail = emailInput.value;
        displayEmail.textContent = newEmail;
        localStorage.setItem('userEmail', newEmail);
        originalEmail = newEmail;
      }
      toggleFieldEditMode("name", false);
      toggleFieldEditMode("email", false);
      if (profileActions) profileActions.style.display = "none";
      window.showNotification('Profile saved!', 'success');
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

  // --- INITIALIZATION ---
  initializeLanguage();
  initializeDarkMode();
  initializeProfile();

  // --- SCROLL HIDE/SHOW FOR NAVBAR AND TABBAR (MOBILE) ---
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');
  const tabbar = document.querySelector('.tabbar');

  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Only apply on mobile (adjust breakpoint as needed, matching CSS)
    if (window.innerWidth <= 767) {
      if (currentScrollTop > lastScrollTop && currentScrollTop > navbar.offsetHeight) {
        // Scrolling down and past the navbar height
        navbar.classList.add('hidden');
        tabbar.classList.add('hidden');
      } else if (currentScrollTop < lastScrollTop) {
        // Scrolling up
        navbar.classList.remove('hidden');
        tabbar.classList.remove('hidden');
      }
    }
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
  });
});

// --- GLOBAL NOTIFICATION SYSTEM ---
window.showNotification = function(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) {
    console.error('Notification container not found!');
    return;
  }

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  container.appendChild(notification);

  // Trigger the animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Automatically hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    notification.addEventListener('transitionend', () => {
      notification.remove();
    });
  }, 3000);
}
