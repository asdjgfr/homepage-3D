<script>
// Import Swiper Svelte components
import { Swiper, SwiperSlide } from "swiper/svelte";
import Homepage from "../views/Homepage.svelte";

// Import Swiper styles
import "swiper/css";
</script>

<Swiper
  spaceBetween="{50}"
  slidesPerView="{3}"
  on:slideChange="{() => console.log('slide change')}"
  on:swiper="{(e) => console.log(e.detail[0])}">
  <SwiperSlide>Slide 1</SwiperSlide>
  <SwiperSlide>Slide 2</SwiperSlide>
  <SwiperSlide>Slide 3</SwiperSlide>
  <SwiperSlide>Slide 4</SwiperSlide>
  <Homepage />
</Swiper>
