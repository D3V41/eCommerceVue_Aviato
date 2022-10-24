<template>
  <div class="home">
    <ProductCards />
  </div>
</template>

<script>
import ProductCards from "../../components/ProductCards.vue";

export default {
  name: "HomeView",
  components: {
    ProductCards,
  },
};
</script>
