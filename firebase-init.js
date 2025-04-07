<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyD2sNbENaPcnWFeat1VRbjFz3B_KvJDc68",
    authDomain: "grades-5b935.firebaseapp.com",
    projectId: "grades-5b935",
    storageBucket: "grades-5b935.firebasestorage.app",
    messagingSenderId: "835110144772",
    appId: "1:835110144772:web:07589610041783dcbc9e51",
    measurementId: "G-9KLD930FGV"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  // Optional: expose db globally for testing
  window.db = db;
</script>
