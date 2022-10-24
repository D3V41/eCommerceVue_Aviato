<template>
  <section style="background-color: #eee">
    <div class="container py-5">
      <div
        class="row justify-content-center mb-3"
        v-for="product in products"
        :key="product._id"
      >
        <div class="col-md-12 col-xl-10">
          <div class="card shadow-0 border rounded-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                  <div
                    class="bg-image hover-zoom ripple rounded ripple-surface"
                  >
                    <img
                      :src="getImgUrl(product)"
                      class="w-100"
                      :alt="product.title"
                    />
                    <a href="">
                      <div class="hover-overlay">
                        <div
                          class="mask"
                          style="background-color: rgba(253, 253, 253, 0.15)"
                        ></div>
                      </div>
                    </a>
                  </div>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-6">
                  <h5>{{ product.title }}</h5>

                  <p class="mb-4 mb-md-0">{{ product.details }}</p>
                </div>
                <div
                  class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start"
                >
                  <div class="d-flex flex-row align-items-center mb-1">
                    <h4 class="mb-1 me-1">${{ product.newPrice }}</h4>
                    <span class="text-danger">
                      <s>${{ product.oldPrice }}</s>
                    </span>
                  </div>
                  <h6 class="text-success">Free shipping</h6>
                  <div class="d-flex flex-column mt-4 bottom">
                    <router-link
                      :to="{
                        name: 'ProductDetailsView',
                        params: {
                          id: product._id,
                        },
                      }"
                      class="btn btn-primary btn-sm"
                      >Show Details</router-link
                    >

                    <button
                      @click="addToCart(product)"
                      class="btn btn-outline-primary btn-sm mt-2 cart-color"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getProducts } from "../../api/product-store.js";
import { useCookies } from "vue3-cookies";
import { findUser } from "../../api/user-store";
import { getCartByUserId, postCart } from "../../api/cart-store";

// to="/cart"

export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      products: [],
    };
  },

  mounted() {
    getProducts().then((res) => {
      this.products = res.data;
    });
  },

  methods: {
    getImgUrl(product) {
      return "data:image/jpeg;base64," + product.src;
    },

    addToCart(product) {
      console.log(product._id);
      if (this.cookies.isKey("username")) {
        findUser(this.cookies.get("username").email)
          .then((res) => {
            let userData = res.data;
            getCartByUserId(userData[0]._id)
              .then((res) => {
                let carts = res.data;
                let qntity = 1;
                if (carts.length != 0) {
                  carts.forEach((c) => {
                    if (c.productId == product._id) {
                      qntity = c.quantity + 1;
                    }
                  });
                }
                let cart = {
                  userId: userData[0]._id,
                  productId: product._id,
                  quantity: qntity,
                };
                postCart(cart)
                  .then((res) => {
                    console.log(cart);
                    this.$router.push("/cart")
                    return;
                  })
                  .catch((err) => {
                    return console.log(err.response.data);
                  });
              })
              .catch((err) => {
                return console.log(err.response.data);
              });
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      } else if (this.cookies.isKey("random")) {
        console.log(this.cookies.get("random").userId);
        getCartByUserId(this.cookies.get("random").userId)
          .then((res) => {
            let carts = res.data;
            let qntity = 1;
            if (carts.length != 0) {
              carts.forEach((c) => {
                if (c.productId == product._id) {
                  qntity = c.quantity + 1;
                }
              });
            }
            let cart = {
              userId: this.cookies.get("random").userId,
              productId: product._id,
              quantity: qntity,
            };
            postCart(cart)
              .then((res) => {
                console.log(cart);
                this.$router.push("/cart")
                return;
              })
              .catch((err) => {
                return console.log(err.response.data);
              });
          })
          .catch((err) => {
            return console.log(err);
          });
      } else {
        let cart = {
          productId: product._id,
          quantity: 1,
        };
        postCart(cart)
          .then((res) => {
            this.cookies.set("random", { userId: res.data.userId });
            this.$router.push("/cart")
            return;
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      }
      // this.$store.commit("addToCart", product);
      // console.log(val.quantity);
    },
  },
};
</script>

<style scoped>
@media (max-width: 767.98px) {
  .border-sm-start-none {
    border-left: none !important;
  }
}

.cart-color {
  color: #0d6efd;
}

a {
  text-decoration: none;
  color: white;
}
</style>
