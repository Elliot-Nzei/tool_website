document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDarkMode = document.body.classList.contains("dark-mode");
  const darkToggleIcon = document.getElementById("darkToggle").querySelector("i");

  if (isDarkMode) {
    darkToggleIcon.classList.remove("fa-moon");
    darkToggleIcon.classList.add("fa-sun");
  } else {
    darkToggleIcon.classList.remove("fa-sun");
    darkToggleIcon.classList.add("fa-moon");
  }
});

document.getElementById("moduleBtn").addEventListener("click", () => {
  alert("Choose a module to start:\n- Resume\n- Finance\n- Health\n- Image");
});

document.getElementById("tabPlus").addEventListener("click", () => {
  alert("Quick Module Launcher:\n- Resume\n- Finance\n- Health\n- Image");
});