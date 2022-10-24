<template>
  <div class="home">
    <BannerSlider />
    <ProductCards />
  </div>
</template>

<script>
import BannerSlider from "../components/BannerSlider.vue";
import ProductCards from "../components/ProductCards.vue";

export default {
  name: "HomeView",
  components: {
    BannerSlider,
    ProductCards,
  },
};
</script>
