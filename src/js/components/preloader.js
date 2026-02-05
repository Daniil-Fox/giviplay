function initPreloader() {
  const preloader = document.querySelector("[data-preloader]");
  if (!preloader) return;

  const splitOverlay = document.querySelector(".split-overlay");

  const bars = document.querySelectorAll("[data-preloader-bar]");
  const values = document.querySelectorAll("[data-preloader-percent]");
  if (!bars.length || !values.length) return;

  let isWindowLoaded = false;
  let isFinished = false;

  const DURATION_MS = 2200;
  const HOLD_BEFORE_SPLIT_MS = 350;

  const start = performance.now();

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const setProgress = (p) => {
    const percent = Math.round(clamp(p, 0, 1) * 100);
    bars.forEach((bar) => {
      bar.style.width = `${percent}%`;
    });
    values.forEach((valueNode) => {
      valueNode.textContent = String(percent);
    });
  };

  const finish = () => {
    if (isFinished) return;
    isFinished = true;

    setProgress(1);

    // Шторка: сначала делим экран по центру через clip-path
    setTimeout(() => {
      preloader.classList.add("preloader--split");
      if (splitOverlay) {
        splitOverlay.classList.add("split-overlay--split");
      }
    }, HOLD_BEFORE_SPLIT_MS);

    // Затем верхняя часть уезжает вверх, нижняя — вниз
    setTimeout(() => {
      preloader.classList.add("preloader--fly-up");
      if (splitOverlay) {
        splitOverlay.classList.add("split-overlay--fly-down");
      }
    }, HOLD_BEFORE_SPLIT_MS + 700);

    // Полностью убираем прелоадер и возвращаем скролл
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      if (splitOverlay) {
        splitOverlay.classList.add("is-hidden");
      }
      document.body.style.overflow = "";
    }, HOLD_BEFORE_SPLIT_MS + 2100);
  };

  const tick = () => {
    if (isFinished) return;
    const now = performance.now();
    const elapsed = now - start;

    let t = clamp(elapsed / DURATION_MS, 0, 1);
    t = easeOut(t);

    // Пока страница не догрузилась, не даём прогрессу уйти дальше 90%
    const maxWhileLoading = isWindowLoaded ? 1 : 0.9;
    const logicalT = Math.min(t, maxWhileLoading);

    setProgress(logicalT);

    if (logicalT >= 1 && isWindowLoaded) {
      finish();
    } else {
      requestAnimationFrame(tick);
    }
  };

  // Блокируем скролл, пока прелоадер активен
  document.body.style.overflow = "hidden";

  window.addEventListener("load", () => {
    isWindowLoaded = true;
  });

  requestAnimationFrame(tick);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPreloader);
} else {
  initPreloader();
}
