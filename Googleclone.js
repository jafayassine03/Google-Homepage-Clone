const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const luckyButton = document.getElementById("luckyBtn");
const themeToggle = document.getElementById("themeToggle");
const suggestionsBox = document.getElementById("suggestions");

let selectedIndex = -1;

const suggestionsData = [
  "JavaScript tutorial",
  "HTML CSS projects",
  "How to learn programming",
  "Frontend developer roadmap",
  "React vs Vue",
  "Best laptops for coding",
  "GitHub portfolio ideas",
  "Dark mode CSS design",
  "How search engines work",
  "Web development projects"
];


searchInput.addEventListener("input", function () {
  const value = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";
  selectedIndex = -1;

  if (value === "") {
    suggestionsBox.style.display = "none";
    return;
  }

  const filtered = suggestionsData.filter(item =>
    item.toLowerCase().includes(value)
  );

  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    li.addEventListener("click", function () {
      searchInput.value = item;
      suggestionsBox.style.display = "none";
      handleSearch();
    });

    suggestionsBox.appendChild(li);
  });

  suggestionsBox.style.display = filtered.length ? "block" : "none";
});


searchInput.addEventListener("keydown", function (e) {
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
    suggestionsBox.style.display = "none";
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


function handleSearch(lucky = false) {
  const query = searchInput.value.trim();

  if (query === "") return;

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

form.addEventListener("submit", function (e) {
  e.preventDefault();
  handleSearch(false);
});

luckyButton.addEventListener("click", function () {
  handleSearch(true);
});

// Dark Mode
window.addEventListener("load", function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
});

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});
