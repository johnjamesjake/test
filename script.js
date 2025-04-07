// Populate Year Dropdown
const yearSelect = document.getElementById('yearSelect');
const semesterSelect = document.getElementById('semesterSelect');

// Generate years from 2018–2030
const currentYear = new Date().getFullYear();
for (let year = 2018; year <= 2030; year++) {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

// Enable semester selection after choosing year
yearSelect.addEventListener('change', () => {
  if (yearSelect.value !== '') {
    semesterSelect.disabled = false;
  } else {
    semesterSelect.disabled = true;
  }
});
