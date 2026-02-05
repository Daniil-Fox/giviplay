import { Swiper } from "swiper";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

Swiper.use([Pagination, Navigation, Thumbs]);

new Swiper(".catalog__container", {
  slidesPerView: "auto",
  spaceBetween: 20,

  breakpoints: {
    320: {
      spaceBetween: 40,
    },
    577: {
      spaceBetween: 20,
    },
  },
});

new Swiper(".packs__slider", {
  slidesPerView: 4,
  spaceBetween: 20,

  breakpoints: {
    320: {
      slidesPerView: "auto",
      spaceBetween: 40,
    },
    577: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});

const categorySliders = document.querySelectorAll(".category__slider");
const categorySwiperInstances = [];

const createCategorySliders = (slidersList) => {
  const list = slidersList || document.querySelectorAll(".category__slider");
  list.forEach((slider) => {
    const instance = new Swiper(slider, {
      slidesPerView: 3,
      spaceBetween: 40,
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        577: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
    });
    categorySwiperInstances.push(instance);
  });
};

const destroyCategorySliders = () => {
  categorySwiperInstances.forEach((swiper) => {
    if (swiper && typeof swiper.destroy === "function") {
      swiper.destroy(true, true);
    }
  });
  categorySwiperInstances.length = 0;
};

if (categorySliders.length > 0) {
  createCategorySliders(categorySliders);

  window.reinitCategorySliders = () => {
    destroyCategorySliders();
    createCategorySliders();
  };

  // Триггер по кастомному событию (вызвать: dispatchEvent(new CustomEvent('reinitCategorySliders')))
  window.addEventListener(
    "reinitCategorySliders",
    window.reinitCategorySliders
  );
}

const modalSlider = document.querySelector(".modal__media");

if (modalSlider) {
  const main = modalSlider.querySelector(".modal__slider");
  const thumbs = modalSlider.querySelector(".modal__thumbs");

  const thumbsSlider = new Swiper(thumbs, {
    slidesPerView: 4,
    spaceBetween: 9,

    breakpoints: {
      320: {
        spaceBetween: 4,
      },
      577: {
        spaceBetween: 9,
      },
    },
  });

  const mainSlider = new Swiper(main, {
    slidesPerView: 1,
    spaceBetween: 40,

    thumbs: {
      swiper: thumbsSlider,
    },
  });
}
