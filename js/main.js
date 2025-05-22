/*
// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.getElementById("noteForm");
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const notesContainer = document.getElementById("notesContainer");

  const toggleModeBtn = document.getElementById("toggleMode");
  const iconSun = document.getElementById("icon-sun");
  const iconMoon = document.getElementById("icon-moon");
  const modeText = document.getElementById("modeText");

  // --- THEME HANDLING ---

  // Initialize theme from localStorage or default to light
  function setTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark");
      iconSun.classList.remove("hidden");
      iconMoon.classList.add("hidden");
      modeText.textContent = "Light Mode";
    } else {
      document.body.classList.remove("dark");
      iconSun.classList.add("hidden");
      iconMoon.classList.remove("hidden");
      modeText.textContent = "Dark Mode";
    }
    localStorage.setItem("theme", theme);
  }

  // Load saved theme on start
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  toggleModeBtn.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  // --- NOTES HANDLING ---

  // Load notes from localStorage
  const getNotes = () => JSON.parse(localStorage.getItem("notes") || "[]");

  // Save notes to localStorage
  const saveNotes = (notes) => localStorage.setItem("notes", JSON.stringify(notes));

  // Render all notes to DOM
  function renderNotes() {
    notesContainer.innerHTML = "";
    const notes = getNotes();

    if (notes.length === 0) {
      notesContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 mt-10 select-none">No notes yet. Add your first note!</p>`;
      return;
    }

    notes.forEach((note, index) => {
      const noteCard = document.createElement("article");
      noteCard.className = "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between";

      noteCard.innerHTML = `
        <div>
          <h2 class="text-xl font-semibold mb-2 break-words">${escapeHtml(note.title)}</h2>
          <p class="whitespace-pre-wrap text-gray-800 dark:text-gray-300 mb-4 break-words">${escapeHtml(note.content)}</p>
        </div>
        <div class="flex space-x-3 justify-end">
          <button class="exportPdfBtn bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition" data-index="${index}" aria-label="Export note as PDF">Export PDF</button>
          <button class="deleteBtn bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition" data-index="${index}" aria-label="Delete note">Delete</button>
        </div>
      `;

      notesContainer.appendChild(noteCard);
    });

    // Attach delete listeners
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        const notes = getNotes();
        notes.splice(idx, 1);
        saveNotes(notes);
        renderNotes();
      });
    });

    // Attach PDF export listeners
    document.querySelectorAll(".exportPdfBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        const notes = getNotes();
        const note = notes[idx];
        exportNoteAsPDF(note);
      });
    });
  }

  // Escape HTML to avoid XSS in notes display
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  // Export single note as PDF using jsPDF
  function exportNoteAsPDF(note) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const marginLeft = 15;
    let cursorY = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(note.title || "Untitled Note", marginLeft, cursorY);
    cursorY += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);

    const splitText = doc.splitTextToSize(note.content || "", 180);
    doc.text(splitText, marginLeft, cursorY);

    doc.save((note.title || "note").replace(/\s+/g, "_") + ".pdf");
  }

  // Handle note form submit
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleVal = noteTitle.value.trim();
    const contentVal = noteContent.value.trim();
    if (!titleVal || !contentVal) return;

    const notes = getNotes();
    notes.push({ title: titleVal, content: contentVal });
    saveNotes(notes);

    noteForm.reset();
    renderNotes();
  });

  // Initial render
  renderNotes();
});
*/
// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.getElementById("noteForm");
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const notesContainer = document.getElementById("notesContainer");

  const toggleModeBtn = document.getElementById("toggleMode");
  const iconSun = document.getElementById("icon-sun");
  const iconMoon = document.getElementById("icon-moon");
  const modeText = document.getElementById("modeText");

  // --- THEME HANDLING ---

  function setTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark");
      iconSun.classList.remove("hidden");
      iconMoon.classList.add("hidden");
      modeText.textContent = "Light Mode";
    } else {
      document.body.classList.remove("dark");
      iconSun.classList.add("hidden");
      iconMoon.classList.remove("hidden");
      modeText.textContent = "Dark Mode";
    }
    localStorage.setItem("theme", theme);
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  toggleModeBtn.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  // --- NOTES HANDLING ---

  const getNotes = () => JSON.parse(localStorage.getItem("notes") || "[]");
  const saveNotes = (notes) => localStorage.setItem("notes", JSON.stringify(notes));

  // Add welcome note if no notes exist
  function addWelcomeNoteIfEmpty() {
    let notes = getNotes();
    if (notes.length === 0) {
      const welcomeNote = {
        title: "👋 Welcome to LumiNote!",
        content: `This is your first note. Here’s a quick guide to get started:\n
- Use the form above to add new notes with a title and content.
- Your notes are saved automatically in your browser.
- Click "Export PDF" on any note to download it.
- Use the dark mode toggle on top right to switch themes.\n
Enjoy using LumiNote to keep your thoughts organized!`
      };
      notes.push(welcomeNote);
      saveNotes(notes);
    }
  }

  function renderNotes() {
    notesContainer.innerHTML = "";
    const notes = getNotes();

    if (notes.length === 0) {
      notesContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 mt-10 select-none">No notes yet. Add your first note!</p>`;
      return;
    }

    notes.forEach((note, index) => {
      const noteCard = document.createElement("article");
      noteCard.className = "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between";

      noteCard.innerHTML = `
        <div>
          <h2 class="text-xl font-semibold mb-2 break-words">${escapeHtml(note.title)}</h2>
          <p class="whitespace-pre-wrap text-gray-800 dark:text-gray-300 mb-4 break-words">${escapeHtml(note.content)}</p>
        </div>
        <div class="flex space-x-3 justify-end">
          <button class="exportPdfBtn bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition" data-index="${index}" aria-label="Export note as PDF">Export PDF</button>
          <button class="deleteBtn bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition" data-index="${index}" aria-label="Delete note">Delete</button>
        </div>
      `;

      notesContainer.appendChild(noteCard);
    });

    // Attach delete listeners
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        const notes = getNotes();
        notes.splice(idx, 1);
        saveNotes(notes);
        renderNotes();
      });
    });

    // Attach PDF export listeners
    document.querySelectorAll(".exportPdfBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        const notes = getNotes();
        const note = notes[idx];
        exportNoteAsPDF(note);
      });
    });
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  function exportNoteAsPDF(note) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const marginLeft = 15;
    let cursorY = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(note.title || "Untitled Note", marginLeft, cursorY);
    cursorY += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);

    const splitText = doc.splitTextToSize(note.content || "", 180);
    doc.text(splitText, marginLeft, cursorY);

    doc.save((note.title || "note").replace(/\s+/g, "_") + ".pdf");
  }

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleVal = noteTitle.value.trim();
    const contentVal = noteContent.value.trim();
    if (!titleVal || !contentVal) return;

    const notes = getNotes();
    notes.push({ title: titleVal, content: contentVal });
    saveNotes(notes);

    noteForm.reset();
    renderNotes();
  });

  // Add welcome note if empty then render
  addWelcomeNoteIfEmpty();
  renderNotes();
});
