import { disableScroll } from "../functions/disable-scroll.js";
import { enableScroll } from "../functions/enable-scroll.js";

(function () {
  const burgers = document.querySelectorAll("[data-burger]");
  if (!burgers.length) return;

  const body = document.body;

  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const getPair = (burger) => {
    const id = burger.getAttribute("data-burger") ?? "";
    const menu = document.querySelector(`[data-menu="${id}"]`);
    const overlay =
      document.querySelector(`[data-menu-overlay="${id}"]`) ||
      menu?.querySelector("[data-menu-overlay]");
    const items = menu?.querySelectorAll("[data-menu-item]") || [];

    return { id, menu, overlay, items };
  };

  const closeMenu = (burger, menu) => {
    if (!burger || !menu) return;
    burger.classList.remove("burger--active");
    menu.classList.remove("menu--active");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
  };

  const openMenu = (burger, menu) => {
    if (!burger || !menu) return;
    burger.classList.add("burger--active");
    menu.classList.add("menu--active");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Закрыть меню");
  };

  const closeAllMenus = () => {
    burgers.forEach((b) => {
      const { menu } = getPair(b);
      closeMenu(b, menu);
    });
    enableScroll();
    body.classList.remove("menu-open");
  };

  burgers.forEach((burger) => {
    const { menu, overlay, items } = getPair(burger);
    if (!menu) return;

    // Если элемент одновременно является dropdown-обёрткой,
    // то на десктопе его поведение контролируется модулем dropdown,
    // а как бургер он должен работать только на мобильных.
    const isDropdownWrapper = burger.hasAttribute("data-dropdown-wrapper");
    if (isDropdownWrapper && !isTouchDevice()) {
      return;
    }

    burger.addEventListener("click", () => {
      const isActive = burger.classList.contains("burger--active");

      if (isActive) {
        closeAllMenus();
      } else {
        closeAllMenus();
        openMenu(burger, menu);
        disableScroll();
        body.classList.add("menu-open");
      }
    });

    overlay?.addEventListener("click", () => {
      closeAllMenus();
    });

    items.forEach((el) => {
      el.addEventListener("click", () => {
        closeAllMenus();
      });
    });
  });
})();
