const lines = document.querySelectorAll("#code span");

lines.forEach(line => {
  line.addEventListener("click", () => {
    line.classList.toggle("selected");
  });
});

function submitAnswer() {
  alert("Your selection has been recorded.\nReturn to the course to submit.");
}
