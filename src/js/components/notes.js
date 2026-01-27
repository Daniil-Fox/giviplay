// Dropdown для кнопки действий заметки на странице видео
(function initNotesDropdown() {
  const actionsBlocks = document.querySelectorAll(".notes__item-actions");
  if (!actionsBlocks.length) return;

  actionsBlocks.forEach((actions) => {
    const toggleBtn = actions.querySelector(".notes__item-actions__open");
    const wrapper = actions.querySelector(".notes__item-actions__dropdown-wrapper");
    const dropdown = actions.querySelector(".notes__item-actions__dropdown");

    if (!toggleBtn || !wrapper || !dropdown) return;

    let isOpen = false;

    function open() {
      const height = dropdown.scrollHeight;
      wrapper.style.maxHeight = `${height}px`;
      actions.classList.add("notes__item-actions_open");
      isOpen = true;
    }

    function close() {
      wrapper.style.maxHeight = "0px";
      actions.classList.remove("notes__item-actions_open");
      isOpen = false;
    }

    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOpen) {
        close();
      } else {
        open();
      }
    });

    // Пересчитываем высоту при ресайзе, если дропдаун открыт
    window.addEventListener("resize", () => {
      if (!isOpen) return;
      const height = dropdown.scrollHeight;
      wrapper.style.maxHeight = `${height}px`;
    });

    // Клик вне блока действий — закрываем дропдаун
    document.addEventListener("click", (e) => {
      if (!isOpen) return;
      if (!actions.contains(e.target)) {
        close();
      }
    });
  });
})();

