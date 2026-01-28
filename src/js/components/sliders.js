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


const categorySliders = document.querySelectorAll('.category__slider')

if(categorySliders.length > 0){
  categorySliders.forEach(slider => {
    new Swiper(slider, {
      slidesPerView: 3,
      spaceBetween: 40
    })
  })
}


const modalSlider = document.querySelector('.modal__media')

if(modalSlider){
  const main = modalSlider.querySelector('.modal__slider')
  const thumbs = modalSlider.querySelector('.modal__thumbs')

  const thumbsSlider = new Swiper(thumbs, {
    slidesPerView: 4,
    spaceBetween: 9,

    breakpoints: {
      320: {
        spaceBetween: 4
      },
      577: {
        spaceBetween: 9
      }
    }
  })

  const mainSlider = new Swiper(main, {
    slidesPerView: 1,
    spaceBetween: 40,

    thumbs: {
      swiper: thumbsSlider
    }
  })
}
