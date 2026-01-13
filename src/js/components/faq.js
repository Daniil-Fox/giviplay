const faq = document.querySelector(".faq");

if (faq) {
  const items = faq.querySelectorAll(".faq__item");

  items.forEach((item) => {
    const content = item.querySelector(".faq__item-content");

    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }

      btn.classList.toggle("faq__item-btn--active");
    });
  });
}
