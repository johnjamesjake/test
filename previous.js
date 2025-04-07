const container = document.getElementById('previousSemesters');
const today = new Date();

Object.keys(localStorage).forEach(key => {
  const data = JSON.parse(localStorage.getItem(key));
  if (!data || !data.endDate || !data.classes) return;

  const end = new Date(data.endDate);
  if (end < today) {
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
