(function () {
  const root = document.querySelector("[data-question]");
  if (!root) return;

  const lines = Array.from(document.querySelectorAll(".line"));
  const submitBtn = document.getElementById("submitBtn");
  const retryBtn = document.getElementById("retryBtn");

  const decisionPanel = document.getElementById("decisionFeedback");
  const evalPanel = document.getElementById("evalFeedback");

  // Config from the HTML page
  const correctLines = (root.dataset.correctLines || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(n => Number(n));

  const explainCorrect = root.dataset.explainCorrect || "Correct.";
  const explainIncorrect = root.dataset.explainIncorrect || "Incorrect.";

  let locked = false;

  function getSelected() {
    return lines
      .filter(el => el.classList.contains("selected"))
      .map(el => Number(el.dataset.line))
      .sort((a,b) => a-b);
  }

  function setsEqual(a, b) {
    if (a.length !== b.length) return false;
    const aa = [...a].sort((x,y) => x-y);
    const bb = [...b].sort((x,y) => x-y);
    return aa.every((v,i) => v === bb[i]);
  }

  function renderDecision(msg) {
    const selected = getSelected();
    const selectedText = selected.length ? selected.join(", ") : "none";

    decisionPanel.innerHTML = `
      <div><strong>${msg}</strong></div>
      <div class="muted">Currently selected line(s): <strong>${selectedText}</strong>. Click a line again to deselect.</div>
      <div class="muted">When ready, press <strong>Submit</strong> to check your answer.</div>
    `;

    submitBtn.disabled = locked || selected.length === 0;
  }

  function showEvaluation(isCorrect) {
    const selected = getSelected();
    const selectedText = selected.length ? selected.join(", ") : "none";
    const correctText = correctLines.length ? correctLines.join(", ") : "none";

    evalPanel.style.display = "block";
    evalPanel.classList.remove("good", "bad");
    evalPanel.classList.add(isCorrect ? "good" : "bad");

    evalPanel.innerHTML = `
      <div style="font-weight:800; margin-bottom:6px;">
        ${isCorrect ? "✅ Correct" : "❌ Incorrect"}
      </div>
      <div style="margin-bottom:8px;">
        You selected: <strong>${selectedText}</strong>. Correct line(s): <strong>${correctText}</strong>.
      </div>
      <div>${isCorrect ? explainCorrect : explainIncorrect}</div>
    `;
  }

  function lock() {
    locked = true;
    lines.forEach(el => el.classList.add("locked"));
    submitBtn.disabled = true;
    retryBtn.disabled = false;
  }

  function resetAll() {
    locked = false;
    lines.forEach(el => {
      el.classList.remove("selected");
      el.classList.remove("locked");
    });
    evalPanel.style.display = "none";
    evalPanel.classList.remove("good", "bad");
    evalPanel.innerHTML = "";
    retryBtn.disabled = true;
    renderDecision("Select the line(s) you believe are incorrect.");
  }

  // Click feedback on every decision
  lines.forEach(el => {
    el.addEventListener("click", () => {
      if (locked) return;

      const lineNo = Number(el.dataset.line);
      const willSelect = !el.classList.contains("selected");
      el.classList.toggle("selected");

      renderDecision(willSelect ? `Selected line ${lineNo}.` : `Removed line ${lineNo}.`);
    });
  });

  // Submit feedback after selection
  submitBtn.addEventListener("click", () => {
    if (locked) return;

    const selected = getSelected();
    const isCorrect = setsEqual(selected, correctLines);

    showEvaluation(isCorrect);
    lock();
    renderDecision("Submitted. Review the feedback below. Click Try Again to retry.");
  });

  retryBtn.addEventListener("click", resetAll);

  // Init
  retryBtn.disabled = true;
  renderDecision("Select the line(s) you believe are incorrect.");
})();
