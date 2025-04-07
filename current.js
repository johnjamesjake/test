const today = new Date();
const container = document.getElementById('currentSemester');
let found = false;

Object.keys(localStorage).forEach(key => {
  const data = JSON.parse(localStorage.getItem(key));
  if (!data || !data.startDate || !data.endDate || !data.classes) return;

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (today >= start && today <= end) {
    found = true;
    const section = document.createElement('div');
    section.innerHTML = `<h3>${key}</h3>`;
    const list = document.createElement('ul');

    Object.keys(data.classes).forEach(cls => {
      const li = document.createElement('li');
      li.textContent = cls;
      list.appendChild(li);
    });

    section.appendChild(list);
    container.appendChild(section);
  }
});

if (!found) {
  container.innerHTML = "<p>No current semester found.</p>";
}
