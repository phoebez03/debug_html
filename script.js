const lines = document.querySelectorAll("#code span");

lines.forEach(line => {
  line.addEventListener("click", () => {
    line.classList.toggle("selected");
  });
});

