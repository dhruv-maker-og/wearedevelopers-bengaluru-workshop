(function workshopApp() {
  "use strict";

  const config = globalThis.WORKSHOP_CONFIG;
  if (!config) {
    throw new Error("Workshop configuration did not load.");
  }

  document.querySelectorAll("[data-url]").forEach((element) => {
    const url = config[element.dataset.url];
    if (!url) throw new Error(`Unknown workshop URL: ${element.dataset.url}`);
    element.href = url;
    if (!element.closest("main > section")) element.target = "_blank";
    if (!element.closest("main > section")) element.rel = "noopener";
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".site-nav");
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navToggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });

  const copyStatus = document.querySelector("#copy-status");
  let statusTimer;
  document.querySelectorAll("[data-copy-url]").forEach((button) => {
    button.addEventListener("click", async () => {
      const url = config[button.dataset.copyUrl];
      if (!url) throw new Error(`Unknown workshop URL: ${button.dataset.copyUrl}`);
      try {
        await navigator.clipboard.writeText(url);
        showCopyStatus("Link copied");
      } catch (error) {
        const helper = document.createElement("textarea");
        helper.value = url;
        helper.setAttribute("readonly", "");
        helper.className = "copy-helper";
        document.body.append(helper);
        helper.select();
        const copied = document.execCommand("copy");
        helper.remove();
        if (!copied) throw error;
        showCopyStatus("Link copied");
      }
    });
  });

  function showCopyStatus(message) {
    window.clearTimeout(statusTimer);
    copyStatus.textContent = message;
    copyStatus.classList.add("is-visible");
    statusTimer = window.setTimeout(() => {
      copyStatus.classList.remove("is-visible");
    }, 1800);
  }

  const storageKey = "wearedevelopers-bengaluru-workshop-checklist-v1";
  const checkboxes = [...document.querySelectorAll("[data-check]")];
  const progress = document.querySelector("#setup-progress");
  const progressLabel = document.querySelector("#progress-label");
  let savedState = {};

  try {
    savedState = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
  } catch (error) {
    console.warn("Checklist progress could not be restored.", error);
  }

  checkboxes.forEach((checkbox) => {
    checkbox.checked = savedState[checkbox.dataset.check] === true;
    checkbox.addEventListener("change", updateProgress);
  });

  function updateProgress() {
    const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
    progress.value = completed;
    progress.textContent = `${completed} of ${checkboxes.length}`;
    progressLabel.textContent = `${completed} of ${checkboxes.length} ready`;
    const state = Object.fromEntries(
      checkboxes.map((checkbox) => [checkbox.dataset.check, checkbox.checked]),
    );
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn("Checklist progress could not be saved.", error);
    }
  }

  document.querySelector("#reset-progress").addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    updateProgress();
    checkboxes[0].focus();
  });

  updateProgress();

  if ("IntersectionObserver" in window) {
    const sections = [...document.querySelectorAll("main > section[id]")];
    const links = [...navigation.querySelectorAll("a")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
            if (isCurrent) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
  }
})();
