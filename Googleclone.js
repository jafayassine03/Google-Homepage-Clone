const form = document.querySelector("form");
const searchInput = document.querySelector("input[name='q']");
const luckyButton = document.querySelector("#luckyBtn");
const themeToggle = document.getElementById("themeToggle");

console.log("Google Clone Ready 🚀");

// search bar

function handleSearch(lucky = false) {
  const query = searchInput.value.trim();

  if (query === "") {
    searchInput.classList.add("error");
    searchInput.placeholder = "Please enter something...";

    setTimeout(() => {
      searchInput.classList.remove("error");
      searchInput.placeholder = "Search Google or type a URL";
    }, 800);

    return;
  }

  if (query.startsWith("http://") || query.startsWith("https://")) {
    window.location.href = query;
    return;
  }

  if (query.includes(".") && !query.includes(" ")) {
    window.location.href = "https://" + query;
    return;
  }

  let url = "https://www.google.com/search?q=" + encodeURIComponent(query);

  if (lucky) {
    url += "&btnI=I";
  }

  window.location.href = url;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  handleSearch(false);
});

luckyButton.addEventListener("click", function () {
  handleSearch(true);
});

document.addEventListener("keydown", function (e) {
  if (e.key === "/") {
    e.preventDefault();
    searchInput.focus();
  }
});

searchInput.addEventListener("change", function () {
  localStorage.setItem("lastSearch", searchInput.value);
});

window.addEventListener("load", function () {
  const savedSearch = localStorage.getItem("lastSearch");
  if (savedSearch) {
    searchInput.value = savedSearch;
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
});

// to make te page dark or light(dark mode extensionn)
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
