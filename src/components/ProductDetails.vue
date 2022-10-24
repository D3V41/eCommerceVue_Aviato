<template>
  <section style="background-color: #eee">
    <div class="container py-5">
      <div class="row justify-content-center mb-3">
        <div class="col-md-12 col-xl-10">
          <div class="card shadow-0 border rounded-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-12 col-lg-5 col-xl-5 mb-4 mb-lg-0">
                  <div
                    class="bg-image hover-zoom ripple rounded ripple-surface"
                  >
                    <img
                      :src="getImgUrl(product)"
                      class="w-100"
                      :alt="product.title"
                    />
                    <a href>
                      <div class="hover-overlay">
                        <div
                          class="mask"
                          style="background-color: rgba(253, 253, 253, 0.15)"
                        ></div>
                      </div>
                    </a>
                  </div>
                </div>
                <div class="col-md-12 col-lg-7 col-xl-7">
                  <h3>
                    <b>{{ product.title }}</b>
                  </h3>
                  <div class="d-flex flex-row align-items-center mb-1">
                    <h4 class="mb-1 me-1">${{ product.newPrice }}</h4>
                    <span class="text-danger">
                      <s>${{ product.oldPrice }}</s>
                    </span>
                  </div>
                  <h5>
                    <b v-if="product.details != ''">Description:</b>
                  </h5>
                  <p class="mb-4 mb-md-0">{{ product.details }}</p>
                  <h6 class="text-success">Free shipping</h6>

                  <div class="d-flex flex-row align-items-center">
                    <!-- <div class="col-md-5"></div> -->
                    <div class="col-md-3 d-flex flex-row align-items-center">
                      <button class="btn btn-link px-2" @click="decrement">
                        <img class="image" src="../assets/minus.png" />
                      </button>

                      <input
                        id="form1"
                        min="0"
                        max="5"
                        name="quantity"
                        v-model="items"
                        type="number"
                        class="form-control form-control-sm"
                      />

                      <button class="btn btn-link px-2" @click="increment">
                        <img class="image" src="../assets/plus.png" />
                      </button>
                    </div>
                    <div class="col-md-9">
                      <button
                        @click="addToCart(product)"
                        class="btn btn-primary btn-sm mt-2 cart-color"
                      >
                        <img
                          src="../assets/cart-icon.png"
                          alt="cart-icon"
                          style="width: 20px; height: 20px; margin-right: 8px"
                        />
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
    </div>
  </section>
</template>

<script>
import { getProductById } from "../../api/product-store.js";
import { useCookies } from "vue3-cookies";
import { findUser } from "../../api/user-store";
import { getCartByUserId, postCart } from "../../api/cart-store";

export default {
  props: ["id"],
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      product: [],
      items: 1,
    };
  },

  mounted() {
    getProductById(this.id).then((res) => {
      this.product = res.data;
    });
  },

  methods: {
    getImgUrl(product) {
      return "data:image/jpeg;base64," + product.src;
    },

    addToCart(product) {
      if (this.cookies.isKey("username")) {
        findUser(this.cookies.get("username").email)
          .then((res) => {
            let userData = res.data;
            getCartByUserId(userData[0]._id)
              .then((res) => {
                let carts = res.data;
                let qntity = this.items;
                if (carts.length != 0) {
                  carts.forEach((c) => {
                    if (c.productId == product._id) {
                      qntity = c.quantity + this.items;
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
            let qntity = this.items;
            if (carts.length != 0) {
              carts.forEach((c) => {
                if (c.productId == product._id) {
                  qntity = c.quantity + this.items;
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
          quantity: this.items,
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

    decrement() {
      this.items = this.items - 1;
    },

    increment() {
      this.items = this.items + 1;
    },
  },
};
</script>

<style scoped>
.btn-height {
  height: 48px;
  font-size: 18px;
}

.mb-4 {
  text-align: left;
}

.text-success {
  margin-top: 1rem;
  text-align: center;
}

.py-5 {
  padding-bottom: 1rem !important;
}

.cart-color {
  color: white;
  height: 48px;
  font-size: 18px;
  padding: 10px 0px 10px 0px;
  width: 100% !important;
}
</style>
