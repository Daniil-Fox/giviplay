function initHeroSoundToggle() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const video = hero.querySelector(".hero__media video");
  const btn = hero.querySelector("[data-hero-sound-toggle]");
  if (!video || !btn) return;

  const TARGET_VOLUME = 0.7;
  const FADE_MS = 280;
  let rafId = 0;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const fadeVolumeTo = (to, { durationMs = FADE_MS, onDone } = {}) => {
    if (rafId) cancelAnimationFrame(rafId);

    const from = Number.isFinite(video.volume) ? video.volume : TARGET_VOLUME;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const k = easeOutCubic(t);
      video.volume = from + (to - from) * k;

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
        if (typeof onDone === "function") onDone();
      }
    };

    rafId = requestAnimationFrame(tick);
  };

  const applyState = () => {
    const isMuted = video.muted;
    btn.classList.toggle("is-unmuted", !isMuted);
    btn.setAttribute("aria-pressed", String(!isMuted));
    btn.setAttribute(
      "aria-label",
      isMuted ? "Включить звук" : "Выключить звук"
    );
  };

  // Базовые настройки (видео в hero обычно muted, но выставим безопасно)
  video.volume = TARGET_VOLUME;
  applyState();

  btn.addEventListener("click", () => {
    const nextMuted = !video.muted;

    if (nextMuted) {
      // Плавно загасить и потом замьютить
      fadeVolumeTo(0, {
        onDone: () => {
          video.muted = true;
          video.volume = TARGET_VOLUME;
          applyState();
        },
      });
      return;
    }

    // Размьютить: стартуем с 0 и плавно поднимаем до TARGET_VOLUME
    video.muted = false;
    video.volume = 0;

    // На iOS/Chrome звук может потребовать явного play() после user gesture
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});

    fadeVolumeTo(TARGET_VOLUME);

    applyState();
  });
}

// Инициализация
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroSoundToggle);
} else {
  initHeroSoundToggle();
}
