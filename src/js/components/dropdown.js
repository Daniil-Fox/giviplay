function initDropdowns() {
  const wrappers = document.querySelectorAll("[data-dropdown-wrapper]");
  if (!wrappers.length) return;

  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  wrappers.forEach((wrapper) => {
    const dropdown = wrapper.querySelector(".dropdown");
    if (!dropdown) return;

    const content = dropdown.querySelector(".dropdown__content");
    if (!content) return;

    let isOpen = false;
    let hoverTimeout = null;

    const setOpen = (open) => {
      if (open === isOpen) return;
      isOpen = open;

      if (isOpen) {
        const fullHeight = content.scrollHeight;
        dropdown.style.maxHeight = `${fullHeight}px`;
      } else {
        dropdown.style.maxHeight = "0px";
      }
    };

    const handleOpen = () => {
      clearTimeout(hoverTimeout);
      setOpen(true);
    };

    const handleCloseWithDelay = () => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => setOpen(false), 120);
    };

    if (isTouchDevice()) {
      // Если этот wrapper одновременно является бургером (data-burger),
      // то на мобильных управление берёт на себя логика бургера.
      // Дропдаун у такого блока на touch-устройствах не инициализируем.
      if (wrapper.hasAttribute("data-burger")) {
        return;
      }

      // На мобильных: клик по обёртке — toggle (открыть/закрыть),
      // клик по пункту — закрыть, клик вне обёртки — закрыть.
      wrapper.addEventListener("click", (e) => {
        const target = e.target;
        const isItem = target.closest(".dropdown__item");

        // Клик по пункту: даём навигации сработать и закрываем меню
        if (isItem) {
          setOpen(false);
          return;
        }

        // Клик по обёртке: переключаем состояние
        e.preventDefault();
        setOpen(!isOpen);
      });

      document.addEventListener("click", (e) => {
        if (!isOpen) return;
        const target = e.target;
        if (!wrapper.contains(target)) {
          setOpen(false);
        }
      });
    } else {
      // На десктопе: по hover
      wrapper.addEventListener("mouseenter", handleOpen);
      wrapper.addEventListener("mouseleave", handleCloseWithDelay);
      dropdown.addEventListener("mouseenter", handleOpen);
      dropdown.addEventListener("mouseleave", handleCloseWithDelay);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDropdowns);
} else {
  initDropdowns();
}
