import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from './firebase-init.js';

// Populate dropdowns
const yearSelect = document.getElementById('year');
for (let y = 2018; y <= 2032; y++) {
  const opt = document.createElement('option');
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

const semesterLabelSelect = document.getElementById('label');
['Semester 1', 'Semester 2'].forEach(label => {
  const opt = document.createElement('option');
  opt.value = label;
  opt.textContent = label;
  semesterLabelSelect.appendChild(opt);
});

let activeSemesterKey = "";
let semesterData = {
  classes: {}
};

document.getElementById('semesterForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const year = document.getElementById('year').value;
  const label = document.getElementById('label').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!year || !label || !startDate || !endDate) return;

  activeSemesterKey = `${year}-${label.replace(" ", "")}`;
  semesterData = {
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

window.addClass = function () {
  const classId = `class-${Date.now()}`;
  const classEl = document.createElement('div');
  classEl.className = "class-block";
  classEl.innerHTML = `
    <div id="${classId}" class="expanded">
      <input type="text" placeholder="Class Code (e.g. COMP1020)" class="class-code" required>
      <div class="assignment-section">
        <h4>Assignments</h4>
        <div class="assignment-list"></div>
        <button type="button" onclick="addAssignment('${classId}')">Add Assignment</button>
      </div>
      <button type="button" onclick="collapseClass('${classId}')">Done</button>
    </div>
  `;
  document.getElementById('classContainer').appendChild(classEl);
};

window.addAssignment = function (classId) {
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
};

window.collapseClass = function (classId) {
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

  semesterData.classes[code] = { assignments };

  const collapsed = document.createElement('div');
  collapsed.textContent = code;
  classBlock.parentElement.replaceWith(collapsed);
};

window.finishSemester = async function () {
  try {
    const docRef = doc(collection(db, "semesters"), activeSemesterKey);
    await setDoc(docRef, semesterData);
    alert(`Semester ${activeSemesterKey} saved to Firebase!`);
    location.reload();
  } catch (err) {
    console.error("🔥 Error saving to Firebase:", err);
    alert("Failed to save semester. Check console for details.");
  }
};
