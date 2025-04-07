// Fill year dropdown
const yearSelect = document.getElementById('year');
for (let y = 2018; y <= 2032; y++) {
  const opt = document.createElement('option');
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

// Handle form submission
document.getElementById('semesterForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const year = document.getElementById('year').value;
  const label = document.getElementById('label').value.trim();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!year || !label || !startDate || !endDate) return;

  const key = `${year}-${label}`;
  const semesterData = {
    year,
    label,
    startDate,
    endDate,
    classes: {}
  };

  localStorage.setItem(key, JSON.stringify(semesterData));
  alert(`Semester ${label} added for ${year}`);
  document.getElementById('semesterForm').reset();
  loadSemesters();
});

// Display saved semesters
function loadSemesters() {
  const container = document.getElementById('semesterList');
  container.innerHTML = '<h3>Saved Semesters</h3>';

  Object.keys(localStorage).forEach(key => {
    if (key.includes('-')) {
      const data = JSON.parse(localStorage.getItem(key));
      const div = document.createElement('div');
      div.innerHTML = `<strong>${key}</strong> (${data.startDate} → ${data.endDate})`;
      container.appendChild(div);
    }
  });
}

loadSemesters();
