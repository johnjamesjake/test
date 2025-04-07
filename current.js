const container = document.getElementById('currentSemester');
const today = new Date();
let found = false;

Object.keys(localStorage).forEach(key => {
  const data = JSON.parse(localStorage.getItem(key));
  if (!data || !data.startDate || !data.endDate || !data.classes) return;

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  // Only show semester if today is within its date range
  if (today >= start && today <= end) {
    found = true;

    const section = document.createElement('div');
    section.innerHTML = `<h3>${key}</h3>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete Semester";
    deleteBtn.style.marginBottom = "1rem";
    deleteBtn.onclick = () => {
      if (confirm(`Delete semester ${key}?`)) {
        localStorage.removeItem(key);
        location.reload();
      }
    };
    section.appendChild(deleteBtn);

    Object.keys(data.classes).forEach(cls => {
      const classBox = document.createElement('div');
      classBox.innerHTML = `<h4>${cls}</h4>`;
      const table = document.createElement('table');
      table.style.width = '100%';
      table.innerHTML = `
        <tr>
          <th>Assignment</th>
          <th>Grade (%)</th>
          <th>Weight (%)</th>
          <th>Due</th>
        </tr>
      `;

      data.classes[cls].assignments.forEach((a, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${a.name}</td>
          <td><input type="number" value="${a.grade}" min="0" max="100" data-class="${cls}" data-index="${idx}" data-field="grade"></td>
          <td><input type="number" value="${a.weight}" min="0" max="100" data-class="${cls}" data-index="${idx}" data-field="weight"></td>
          <td><input type="date" value="${a.due || ''}" data-class="${cls}" data-index="${idx}" data-field="due"></td>
        `;
        table.appendChild(row);
      });

      classBox.appendChild(table);
      section.appendChild(classBox);
    });

    container.appendChild(section);
  }
});

if (!found) {
  container.innerHTML = "<p>No current semester found.</p>";
}

// Auto-save changes to localStorage when inputs change
container.addEventListener('input', (e) => {
  const input = e.target;
  const semesterKey = container.querySelector('h3')?.textContent;
  if (!semesterKey) return;

  const className = input.dataset.class;
  const index = input.dataset.index;
  const field = input.dataset.field;
  const value = field === "due" ? input.value : parseFloat(input.value);

  const data = JSON.parse(localStorage.getItem(semesterKey));
  if (data && data.classes[className] && data.classes[className].assignments[index]) {
    data.classes[className].assignments[index
