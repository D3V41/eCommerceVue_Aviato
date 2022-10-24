<template>
  <div
    id="carouselExampleCaptions"
    class="carousel slide"
    data-bs-ride="carousel"
  >
    <div class="carousel-indicators">
      <div v-for="(banner, index) in banners" :index="index" :key="banner.id">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          :data-bs-slide-to="`${index}`"
          :class="{ active: index == 0 }"
          :aria-current="{ active: index == 0 }"
        ></button>
      </div>
    </div>
    <div class="carousel-inner">
      <div
        v-for="(banner, index) in banners"
        :index="index"
        :key="banner.id"
        class="carousel-item"
        :class="index == 0 && ' active'"
      >
        <img
          :src="getImgUrl(banner)"
          class="d-block w-100"
          :alt="banner.title"
        />
        <div class="carousel-caption d-none d-md-block">
          <h5>{{ banner.title }}</h5>
          <p>{{ banner.subtitle }}</p>
        </div>
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleCaptions"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleCaptions"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script>
import {getBanners} from "../../api/banner-store.js"
export default {
  data() {
    return {
      banners: [],
    };
  },

  mounted() {
    getBanners().then((res) => {
      this.banners = res.data;
    });
  },

  methods: {
    getImgUrl(banner) {
      return "data:image/jpeg;base64," + banner.src;
    },
  },
};
</script>

<style scoped>
img {
  width: 100% !important;
  height: 300px;
  object-fit: cover;
}
</style>
