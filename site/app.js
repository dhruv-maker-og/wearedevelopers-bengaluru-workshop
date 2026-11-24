const storageKey = "wearedevelopers-bengaluru-2026-checklist";
const checks = [...document.querySelectorAll("[data-check]")];
const count = document.querySelector("#progress-count");
const bar = document.querySelector("#progress-bar");
const progress = document.querySelector('[role="progressbar"]');
const toast = document.querySelector("#toast");
let toastTimer;

function savedChecks() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function updateProgress() {
  const completed = checks.filter((check) => check.checked).length;
  count.textContent = completed;
  progress.setAttribute("aria-valuenow", completed);
  bar.style.setProperty("--progress", completed / checks.length);
  try {
    localStorage.setItem(storageKey, JSON.stringify(checks.filter((check) => check.checked).map((check) => check.dataset.check)));
  } catch {
    // The checklist remains usable when storage is blocked.
  }
}

const saved = new Set(savedChecks());
for (const check of checks) {
  check.checked = saved.has(check.dataset.check);
  check.addEventListener("change", updateProgress);
}
updateProgress();

document.querySelector("#clear-progress")?.addEventListener("click", () => {
  for (const check of checks) check.checked = false;
  updateProgress();
  announce("Checklist reset");
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      announce("Copied to clipboard");
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.className = "clipboard-fallback";
      document.body.append(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      announce(copied ? "Copied to clipboard" : "Copy failed. Select and copy the visible link.");
    }
  });
});

function announce(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}
