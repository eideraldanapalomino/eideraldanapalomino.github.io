
(() => {
  const stored = localStorage.getItem("eider-language");
  let language = stored || "en";
  const applyLanguage = () => {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-en][data-es]").forEach((el) => {
      el.textContent = el.dataset[language];
    });
    document.querySelectorAll("[data-lang-label]").forEach((el) => {
      el.textContent = language === "en" ? "ES" : "EN";
    });
    const title = document.body.dataset[language + "Title"];
    if (title) document.title = title;
  };
  document.querySelectorAll("[data-lang-label]").forEach((button) => {
    button.addEventListener("click", () => {
      language = language === "en" ? "es" : "en";
      localStorage.setItem("eider-language", language);
      applyLanguage();
    });
  });
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-wrap");
  if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));
  applyLanguage();

  // Home-page photo carousel
  const carousel = document.querySelector(".photo-carousel");
  if (carousel) {
    const photoFiles = [
      "assets/profile.jpg",
      "assets/IMG_1605.jpg", "assets/IMG_1607.JPG", "assets/IMG_1783.JPG",
      "assets/IMG_1796.JPG", "assets/IMG_1867.JPG", "assets/IMG_1898.JPG",
      "assets/IMG_2146.jpg", "assets/IMG_2150.JPG", "assets/IMG_2240.jpg",
      "assets/IMG_2245.JPG", "assets/IMG_2330.jpg", "assets/IMG_2331.JPG",
      "assets/IMG_2379.jpg", "assets/IMG_2434.jpg", "assets/IMG_2437.JPG",
      "assets/IMG_2468.JPG", "assets/IMG_2513.JPG", "assets/IMG_2657.jpg",
      "assets/IMG_2755.jpg", "assets/IMG_9590.jpg"
    ];
    const image = carousel.querySelector(".carousel-image");
    const indicators = carousel.querySelector(".carousel-indicators");
    const previous = carousel.querySelector(".carousel-prev");
    const next = carousel.querySelector(".carousel-next");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let currentIndex = 0, intervalId = null, changeTimeout = null, paused = false, changing = false;

    const indicatorButtons = photoFiles.map((file, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Show photo ${index + 1} of ${photoFiles.length}`);
      button.setAttribute("aria-current", index === 0 ? "true" : "false");
      button.addEventListener("click", () => showPhoto(index, true));
      indicators.appendChild(button);
      return button;
    });

    const preload = (index) => { const img = new Image(); img.src = photoFiles[index]; };
    const updateIndicators = () => indicatorButtons.forEach((button, index) =>
      button.setAttribute("aria-current", index === currentIndex ? "true" : "false"));

    const stopTimer = () => {
      if (intervalId !== null) window.clearInterval(intervalId);
      intervalId = null;
    };
    const startTimer = () => {
      stopTimer();
      if (!paused && !reducedMotion) {
        intervalId = window.setInterval(() => showPhoto((currentIndex + 1) % photoFiles.length), 5000);
      }
    };
    const restartTimer = () => { stopTimer(); startTimer(); };

    function showPhoto(index, resetTimer = false) {
      if (changing || index === currentIndex) {
        if (resetTimer) restartTimer();
        return;
      }
      changing = true;
      const nextIndex = (index + photoFiles.length) % photoFiles.length;
      image.classList.remove("is-active");
      window.clearTimeout(changeTimeout);
      changeTimeout = window.setTimeout(() => {
        image.src = photoFiles[nextIndex];
        image.alt = `Photo ${nextIndex + 1} of ${photoFiles.length}`;
        currentIndex = nextIndex;
        updateIndicators();
        image.classList.add("is-active");
        changing = false;
        preload((currentIndex + 1) % photoFiles.length);
      }, reducedMotion ? 0 : 420);
      if (resetTimer) restartTimer();
    }

    previous.addEventListener("click", () => showPhoto(currentIndex - 1, true));
    next.addEventListener("click", () => showPhoto(currentIndex + 1, true));
    carousel.addEventListener("mouseenter", () => { paused = true; stopTimer(); });
    carousel.addEventListener("mouseleave", () => { paused = false; startTimer(); });
    carousel.addEventListener("focusin", () => { paused = true; stopTimer(); });
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) { paused = false; startTimer(); }
    });
    preload(1);
    startTimer();
  }

})();
