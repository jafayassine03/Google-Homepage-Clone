const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const luckyButton = document.getElementById("luckyBtn");
const themeToggle = document.getElementById("themeToggle");
const suggestionsBox = document.getElementById("suggestions");

let selectedIndex = -1;


function getHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function saveToHistory(query) {
  let history = getHistory();

  if (!history.includes(query)) {
    history.unshift(query);
  }

  history = history.slice(0, 8); // limiting historry
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

function clearHistory() {
  localStorage.removeItem("searchHistory");
  renderSuggestions([]);
}



function renderSuggestions(list) {
  suggestionsBox.innerHTML = "";
  selectedIndex = -1;

  if (list.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    li.addEventListener("click", () => {
      searchInput.value = item;
      suggestionsBox.style.display = "none";
      handleSearch();
    });

    suggestionsBox.appendChild(li);
  });

  const clearBtn = document.createElement("li");
  clearBtn.textContent = "Clear search history";
  clearBtn.style.fontWeight = "bold";
  clearBtn.style.color = "red";
  clearBtn.addEventListener("click", clearHistory);
  suggestionsBox.appendChild(clearBtn);

  suggestionsBox.style.display = "block";
}


searchInput.addEventListener("focus", () => {
  renderSuggestions(getHistory());
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const history = getHistory();

  const filtered = history.filter(item =>
    item.toLowerCase().includes(value)
  );

  renderSuggestions(filtered);
});

searchInput.addEventListener("keydown", (e) => {
  const items = suggestionsBox.querySelectorAll("li");

  if (e.key === "ArrowDown") {
    selectedIndex++;
    updateActive(items);
  }

  if (e.key === "ArrowUp") {
    selectedIndex--;
    updateActive(items);
  }

  if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault();
    searchInput.value = items[selectedIndex].textContent;
    handleSearch();
  }
});

function updateActive(items) {
  items.forEach(item => item.classList.remove("active"));

  if (selectedIndex >= items.length) selectedIndex = 0;
  if (selectedIndex < 0) selectedIndex = items.length - 1;

  if (items[selectedIndex]) {
    items[selectedIndex].classList.add("active");
  }
}

function showLoading() {
  document.body.classList.add("loading");
}


function handleSearch(lucky = false) {
  const query = searchInput.value.trim();
  if (query === "") return;

  saveToHistory(query);
  showLoading();

  setTimeout(() => {
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
  }, 500);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch(false);
});

luckyButton.addEventListener("click", () => {
  handleSearch(true);
});

// Dark Mode

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
});

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
