import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from './firebase-init.js';

async function loadCurrentSemester() {
  const container = document.getElementById('currentDisplay');
  container.innerHTML = '';

  const today = new Date();
  const snapshot = await getDocs(collection(db, "semesters"));

  let found = false;

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (today >= start && today <= end) {
      found = true;
      const div = document.createElement('div');
      div.className = 'semester-block';
      div.innerHTML = `<h3>${data.year} - ${data.label}</h3>`;
      
      if (data.classes) {
        const ul = document.createElement('ul');
        Object.entries(data.classes).forEach(([code, details]) => {
          const li = document.createElement('li');
          li.textContent = code;
          ul.appendChild(li);
        });
        div.appendChild(ul);
      }

      container.appendChild(div);
    }
  });

  if (!found) {
    container.innerHTML = "<p>No current semester found.</p>";
  }
}

loadCurrentSemester();
