let semesters = {};
let activeSemesterKey = "";

// Populate year dropdown
const yearSelect = document.getElementById('year');
for (let y = 2018; y <= 2032; y++) {
  const opt = document.createElement('option');
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

// Handle semester form
document.getElementById('semesterForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const year = document.getElementById('year').value;
  const label = document.getElementById('label').value.trim();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!year || !label || !startDate || !endDate) return;

  const key = `${year}-${label}`;
  activeSemesterKey = key;
  semesters[key] = {
    year,
    label,
    startDate,
    endDate,
    classes: {}
  };

  document.getElementById('semesterForm').style.display = "none";
  renderClassSection();
});

function renderClassSection() {
  const container = document.getElementById('semesterList');
  container.innerHTML = `
    <h3>${activeSemesterKey}</h3>
    <div id="classContainer"></div>
    <button onclick="addClass()">Add Class</button>
    <button onclick="finishSemester()">Finish Semester</button>
  `;
}

function addClass() {
  const classId = `class-${Date.now()}`;
  const classEl = document.createElement('div');
  classEl.className = "class-block";
  classEl.innerHTML = `
    <div id="${classId}" class="expanded">
      <input type="text" placeholder="Class Code (e.g. COMP1020)" class="class-code" required>
      <div class="assignment-section">
        <h4>Assignments</h4>
        <div class="assignment-list"></div>
        <button onclick="addAssignment('${classId}')">Add Assignment</button>
      </div>
      <button onclick="collapseClass('${classId}')">Done</button>
    </div>
  `;
  document.getElementById('classContainer').appendChild(classEl);
}

function addAssignment(classId) {
  const container = document.querySelector(`#${classId} .assignment-list`);
  const row = document.createElement('div');
  row.className = "assignment-row";
  row.innerHTML = `
    <input type="text" placeholder="Assignment Name" class="a-name">
    <input type="number" placeholder="Grade (%)" class="a-grade" min="0" max="100">
    <input type="number" placeholder="Weight (%)" class="a-weight" min="0" max="100">
    <input type="date" class="a-date">
  `;
  container.appendChild(row);
}

function collapseClass(classId) {
  const classBlock = document.getElementById(classId);
  const code = classBlock.querySelector('.class-code').value.trim();
  if (!code) return alert("Please enter a class code.");

  const assignments = [];
  classBlock.querySelectorAll('.assignment-row').forEach(row => {
    const name = row.querySelector('.a-name').value.trim();
    const grade = parseFloat(row.querySelector('.a-grade').value);
    const weight = parseFloat(row.querySelector('.a-weight').value);
    const date = row.querySelector('.a-date').value;

    if (name && !isNaN(grade) && !isNaN(weight)) {
      assignments.push({ name, grade, weight, due: date || null });
    }
  });

  semesters[activeSemesterKey].classes[code] = {
    assignments
  };

  // Collapse to summary view
  const collapsed = document.createElement('div');
  collapsed.textContent = code;
  classBlock.parentElement.replaceWith(collapsed);
}

function finishSemester() {
  if (!activeSemesterKey) return;
  localStorage.setItem(activeSemesterKey, JSON.stringify(semesters[activeSemesterKey]));
  alert(`Semester ${activeSemesterKey} saved.`);
  location.reload(); // Refresh page to allow new entry
}
