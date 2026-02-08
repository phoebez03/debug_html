const root = document.querySelector("[data-correct]");
const lines = document.querySelectorAll(".line");
const submitBtn = document.getElementById("submit");
const decision = document.getElementById("decision");
const feedback = document.getElementById("feedback");

const correctLines = root.dataset.correct
  .split(",")
  .map(n => Number(n.trim()));

let locked = false;

function getSelected() {
  return [...document.querySelectorAll(".line.selected")]
    .map(el => Number(el.dataset.line));
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.sort().every((v, i) => v === b.sort()[i]);
}

lines.forEach(line => {
  line.addEventListener("click", () => {
    if (locked) return;

    line.classList.toggle("selected");

    const selected = getSelected();
    decision.innerHTML = `
      <strong>Selection updated.</strong><br>
      Selected line(s): ${selected.length ? selected.join(", ") : "none"}
    `;

    submitBtn.disabled = selected.length === 0;
  });
});

submitBtn.addEventListener("click", () => {
  const selected = getSelected();
  const correct = arraysEqual(selected, correctLines);

  locked = true;

  feedback.className = "panel " + (correct ? "good" : "bad");
  feedback.innerHTML = correct
    ? root.dataset.correctFeedback
    : root.dataset.incorrectFeedback;

  feedback.style.display = "block";
});

