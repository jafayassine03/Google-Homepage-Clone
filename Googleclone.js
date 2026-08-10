const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const luckyButton = document.getElementById("luckyBtn");
const themeToggle = document.getElementById("themeToggle");
const historyBox = document.getElementById("searchHistory");
const voiceButton = document.getElementById("voiceBtn");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});

function getHistory() {
  return JSON.parse(localStorage.getItem("searches")) || [];
}

function saveSearch(query) {
  let history = getHistory();
  if (!history.includes(query)) {
    history.unshift(query);
  }
  if (history.length > 5) history.pop();
  localStorage.setItem("searches", JSON.stringify(history));
}

function removeHistoryItem(itemToRemove, event) {
  event.stopPropagation();
  let history = getHistory();
  history = history.filter(item => item !== itemToRemove);
  localStorage.setItem("searches", JSON.stringify(history));
  renderHistory(history);
}

function renderHistory(list) {
  historyBox.innerHTML = "";
  list.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("history-item");

    const textSpan = document.createElement("span");
    textSpan.textContent = item;
    textSpan.style.flexGrow = "1";
    div.appendChild(textSpan);

    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "✕";
    deleteBtn.classList.add("delete-history");
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", (e) => removeHistoryItem(item, e));
    div.appendChild(deleteBtn);

    div.addEventListener("click", () => {
      searchInput.value = item;
      historyBox.innerHTML = "";
    });

    historyBox.appendChild(div);
  });
}

searchInput.addEventListener("focus", () => renderHistory(getHistory()));
searchInput.addEventListener("input", () => {
  const filtered = getHistory().filter(item =>
    item.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  renderHistory(filtered);
});

document.addEventListener("click", (e) => {
  if (!form.contains(e.target)) {
    historyBox.innerHTML = "";
  }
});

function handleSearch(lucky = false) {
  const query = searchInput.value.trim();
  if (!query) return;

  saveSearch(query);

  if (query.startsWith("http://") || query.startsWith("https://")) {
    window.location.href = query;
    return;
  }
  if (query.includes(".") && !query.includes(" ")) {
    window.location.href = "https://" + query;
    return;
  }

  let url = "https://www.google.com/search?q=" + encodeURIComponent(query);
  if (lucky) url += "&btnI=I";

  window.location.href = url;
}

if (voiceButton) {
  voiceButton.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      searchInput.value = speechToText;
      handleSearch(false);
    };

    recognition.onerror = () => {
      alert("Voice recognition error occurred.");
    };
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch(false);
});

luckyButton.addEventListener("click", () => handleSearch(true));
