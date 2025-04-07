import { collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const container = document.getElementById('currentSemester');
const today = new Date();

async function loadCurrentSemester() {
  const snapshot = await getDocs(collection(db, "semesters"));
  let found = false;

  snapshot.forEach(docSnap => {
    const key = docSnap.id;
    const data = docSnap.data();

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (today >= start && today <= end) {
      found = true;
      renderSemester(key, data);
    }
  });

  if (!found) {
    container.innerHTML = "<p>No current semester found.</p>";
  }
}

function renderSemester(key, data) {
  const section = document.createElement('div');
  section.innerHTML = `<h3>${key}</h3>`;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "Delete Semester";
  deleteBtn.onclick = async () => {
    if (confirm(`Delete semester ${key}?`)) {
      await deleteDoc(doc(db, "semesters", key));
      location.reload();
    }
  };
  section.appendChild(deleteBtn);

  Object.entries(data.classes || {}).forEach(([cls, clsData]) => {
    const classBox = document.createElement('div');
    classBox.innerHTML = `<h4>${cls}</h4>`;
    const table = document.createElement('table');
    table.innerHTML = `
      <tr><th>Assignment</th><th>Grade (%)</th><th>Weight (%)</th><th>Due</th></tr>
    `;

    (clsData.assignments || []).forEach((a, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${a.name}</td>
        <td><input type="number" value="${a.grade}" data-class="${cls}" data-i="${i}" data-key="${key}" data-field="grade"></td>
        <td><input type="number" value="${a.weight}" data-class="${cls}" data-i="${i}" data-key="${key}" data-field="weight"></td>
        <td><input type="date" value="${a.due || ''}" data-class="${cls}" data-i="${i}" data-key="${key}" data-field="due"></td>
      `;
      table.appendChild(row);
    });

    classBox.appendChild(table);
    section.appendChild(classBox);
  });

  container.appendChild(section);
}

container.addEventListener('input', async (e) => {
  const input = e.target;
  const { class: className, i, key, field } = input.dataset;
  const newVal = field === 'due' ? input.value : parseFloat(input.value);

  const docRef = doc(db, "semesters", key);
  const docSnap = await docRef.get();
  if (!docSnap.exists()) return;

  const data = docSnap.data();
  data.classes[className].assignments[i][field] = newVal;
  await updateDoc(docRef, { classes: data.classes });
});

loadCurrentSemester();
