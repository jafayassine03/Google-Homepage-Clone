const form = document.querySelector("form");
const searchInput = document.querySelector("input[name='q']");
const luckyButton = document.querySelector(".buttons button[type='button']");

form.addEventListener("submit", function (e) {
  e.preventDefault(); 

  const query = searchInput.value.trim();

  if (query !== "") {
    window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
  }
});

luckyButton.addEventListener("click", function () {
  const query = searchInput.value.trim();

  if (query !== "") {
    window.location.href = "https://www.google.com/search?q=" 
      + encodeURIComponent(query) 
      + "&btnI=I";
  }
});
