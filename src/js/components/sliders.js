import { Swiper } from "swiper";
import { Navigation, Pagination } from "swiper/modules";

Swiper.use([Pagination, Navigation]);

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
