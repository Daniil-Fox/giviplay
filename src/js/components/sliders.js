import { Swiper } from "swiper";
import { Navigation, Pagination } from "swiper/modules";

Swiper.use([Pagination, Navigation]);

new Swiper(".catalog__container", {
  slidesPerView: "auto",
  spaceBetween: 20,
});
