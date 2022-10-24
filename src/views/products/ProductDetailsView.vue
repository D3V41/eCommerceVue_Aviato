<template>
  <div class="home">
    <ProductDetails :id="id" />
    <ShowReviews :id="id"/>
  </div>
</template>

<script>
import ProductDetails from "../../components/ProductDetails.vue";
import ShowReviews from "../../components/ShowReviews.vue";

export default {
  props: ["id"],
  name: "HomeView",
  components: {
    ProductDetails,
    ShowReviews,
  },
};
</script>
