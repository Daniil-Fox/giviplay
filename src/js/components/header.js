// const header = document.querySelector(".header");

// if (header) {
//   const navigations = header.querySelectorAll(".nav");

//   if (navigations.length) {
//     navigations.forEach((nav) => {
//       const navWithChildren = nav.querySelectorAll(".menu-item-has-children");

//       navWithChildren.forEach((item) => {
//         const subMenu = item.querySelector(".sub-menu");

//         if (subMenu) {
//           item.addEventListener("mouseenter", (e) => {
//             item.classList.add("active");
//             subMenu.style.maxHeight = subMenu.scrollHeight + "px";
//           });
//           item.addEventListener("mouseleave", (e) => {
//             item.classList.remove("active");
//             subMenu.style.maxHeight = null;
//           });
//         }
//       });
//     });
//   }
// }

(function () {
  const header = document.querySelector(".header");
  if (!header) return;
  let lastScroll = window.scrollY;
  let ticking = false;
  let headerHeight = 0;
  let isFixed = false;
  let hideTimeout = null;

  function getHeaderFullHeight() {
    const style = window.getComputedStyle(header);
    const marginTop = parseFloat(style.marginTop) || 0;
    const marginBottom = parseFloat(style.marginBottom) || 0;
    return header.offsetHeight + marginTop + marginBottom;
  }

  function setBodyPadding(pad) {
    if (header.classList.contains("header_main")) return;
    document.body.style.paddingTop = pad ? getHeaderFullHeight() + "px" : "";
  }

  function onScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll < 30) {
      // Почти в самом верху — возвращаем header в исходное состояние
      header.classList.remove("header--fixed", "header--hidden");
      setBodyPadding(false);
      isFixed = false;
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    } else if (currentScroll > lastScroll && currentScroll > headerHeight * 2) {
      // Скролл вниз — скрываем
      header.classList.add("header--hidden");
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        header.classList.remove("header--fixed");
        setBodyPadding(false);
        isFixed = false;
      }, 300); // 300ms = transition
    } else if (currentScroll < lastScroll) {
      // Скролл вверх — показываем
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      header.classList.remove("header--hidden");
      if (!isFixed) {
        header.classList.add("header--fixed");
        setBodyPadding(true);
        isFixed = true;
      }
    }
    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
})();
