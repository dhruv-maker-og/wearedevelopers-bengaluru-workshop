(() => {
  const config = window.EVENT_CONFIG;
  const storageKey = "copilot-workshop-checklist-v1";
  const checkboxes = [...document.querySelectorAll("[data-step]")];
  const count = document.querySelector("#progress-count");
  const resetButton = document.querySelector("#reset-checklist");
  const toast = document.querySelector("#toast");
  let toastTimer;

  if (!config) {
    document.documentElement.dataset.configError = "true";
    console.error("Event configuration did not load.");
    return;
  }

  document.querySelectorAll("[data-config-text]").forEach((element) => {
    element.textContent = config[element.dataset.configText] ?? "";
  });

  document.querySelectorAll("[data-url]").forEach((link) => {
    const url = config[link.dataset.url];
    if (url) {
      link.href = url;
    } else {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
    }
  });

  function announce(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function readProgress() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
      return new Set(Array.isArray(stored) ? stored : []);
    } catch (error) {
      console.warn("Could not restore checklist progress.", error);
      return new Set();
    }
  }

  function persistProgress() {
    const completed = checkboxes.filter((item) => item.checked).map((item) => item.dataset.step);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(completed));
    } catch (error) {
      console.warn("Could not save checklist progress.", error);
      announce("Progress could not be saved in this browser.");
    }
    count.textContent = String(completed.length);
  }

  const completed = readProgress();
  checkboxes.forEach((checkbox) => {
    checkbox.checked = completed.has(checkbox.dataset.step);
    checkbox.addEventListener("change", persistProgress);
  });
  persistProgress();

  resetButton?.addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    persistProgress();
    announce("Checklist reset on this device.");
  });

  async function copyText(url) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) {
      throw new Error("Browser copy command failed.");
    }
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const url = config[button.dataset.copy];
      if (!url) return;

      try {
        await copyText(url);
        announce("Link copied.");
      } catch (error) {
        console.error("Could not copy link.", error);
        announce("Could not copy. Open the link and copy it from the address bar.");
      }
    });
  });
})();
