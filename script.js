const yearSelect = document.getElementById('yearSelect');
const semesterSelect = document.getElementById('semesterSelect');
const contentArea = document.getElementById('contentArea');

let currentYear = '';
let currentSemester = '';

// Populate years dynamically from current year to 2030
const startYear = new Date().getFullYear();
for (let year = startYear; year <= 2030; year++) {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

// Enable semester selection after choosing year
yearSelect.addEventListener('change', () => {
  semesterSelect.disabled = yearSelect.value === '';
  currentYear = yearSelect.value;
  clearSubjects();
});

// Store semester choice
semesterSelect.addEventListener('change', () => {
  currentSemester = semesterSelect.value;
  renderSubjectInput();
  renderSubjects();
});

function getStorageKey() {
  return `${currentYear}-${currentSemester}`;
}

function renderSubjectInput() {
  contentArea.innerHTML = `
    <h2>${currentYear} - ${currentSemester}</h2>
    <div class="subject-input">
      <input type="text" id="subjectName" placeholder="Enter subject code (e.g. MATH101)">
      <button onclick="addSubject()">Add Subject</button>
    </div>
    <ul id="subjectList"></ul>
  `;
}

function addSubject() {
  const subjectInput = document.getElementById('subjectName');
  const subjectName = subjectInput.value.trim();
  if (subjectName === '') return;

  const key = getStorageKey();
  let subjects = JSON.parse(localStorage.getItem(key)) || [];
  if (!subjects.includes(subjectName)) {
    subjects.push(subjectName);
    localStorage.setItem(key, JSON.stringify(subjects));
  }

  subjectInput.value = '';
  renderSubjects();
}

function renderSubjects() {
  const key = getStorageKey();
  const subjects = JSON.parse(localStorage.getItem(key)) || [];
  const list = document.getElementById('subjectList');
  if (!list) return;

  list.innerHTML = '';
  subjects.forEach(subject => {
    const li = document.createElement('li');
    li.textContent = subject;
    list.appendChild(li);
  });
}

function clearSubjects() {
  contentArea.innerHTML = '';
}
