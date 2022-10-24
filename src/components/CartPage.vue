<template>
  <section class="h-100 h-custom" style="background-color: #c0c0c0">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12">
          <div
            class="card card-registration card-registration-2"
            style="border-radius: 15px"
          >
            <div class="card-body p-0">
              <div class="row g-0">
                <div class="col-lg-8">
                  <div class="p-5">
                    <div
                      class="d-flex justify-content-between align-items-center mb-5"
                    >
                      <h1 class="fw-bold mb-0 text-black">Shopping Cart</h1>
                      <h6 class="mb-0 text-muted">
                        {{ products.length }} items
                      </h6>
                    </div>
                    <!-- {{ this.$store.getters.getCart }} -->
                    <hr class="my-4" />
                    <div v-for="product in products" :key="product.id">
                      <div
                        class="row mb-4 d-flex justify-content-between align-items-center"
                      >
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <img
                            :src="getImgUrl(product)"
                            class="w-100"
                            :alt="product.title"
                          />
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-3">
                          <h6 class="text-muted">{{ product.type }}</h6>
                          <h6 class="text-black mb-0">{{ product.title }}</h6>
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                          <button
                            class="btn btn-link px-2"
                            @click="minusQuantity(product)"
                          >
                            <img class="image" src="../assets/minus.png" />
                          </button>

                          <input
                            id="form1"
                            min="0"
                            name="quantity"
                            v-model="product.quantity"
                            type="number"
                            class="form-control form-control-sm"
                            disabled
                          />

                          <button
                            class="btn btn-link px-2"
                            @click="plusQuantity(product)"
                          >
                            <img class="image" src="../assets/plus.png" />
                          </button>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2 offset-lg-1">
                          <h6 class="mb-0">
                            <h4 class="mb-1 me-1">{{ product.newPrice }}</h4>
                            <span class="text-danger">
                              <s>{{ product.oldPrice }}</s>
                            </span>
                          </h6>
                        </div>
                        <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                          <button
                            class="btn btn-link x-1"
                            @click="removeProduct(product.id)"
                          >
                            <img style="width: 60%" src="../assets/cross.png" />
                          </button>
                        </div>
                      </div>
                      <hr class="my-4" />
                    </div>

                    <div class="pt-5">
                      <h6 class="mb-0">
                        <a href="#" class="text-body">
                          <i class="fas fa-long-arrow-alt-left me-2"></i>Back to
                          shop
                        </a>
                      </h6>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 bg-grey">
                  <div class="p-5">
                    <h3 class="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                    <hr class="my-4" />

                    <div class="d-flex justify-content-between mb-4">
                      <h5 class="text-uppercase">
                        items {{ products.length }}
                      </h5>
                      <h5>€ {{ price.toFixed(2) }}</h5>
                    </div>

                    <h5 class="text-uppercase mb-3">Taxes</h5>

                    <div class="d-flex justify-content-between mb-4">
                      <h5 class="text-uppercase">Tax (13%)</h5>
                      <h5>€ {{ (0.13 * price).toFixed(2) }}</h5>
                    </div>

                    <hr class="my-4" />

                    <div class="d-flex justify-content-between mb-5">
                      <h5 class="text-uppercase">Total price</h5>
                      <h5>€ {{ (1.13 * price).toFixed(2) }}</h5>
                    </div>

                    <div v-if="!isSignedIn">
                      <div class="form-floating">
                        <input
                          type="text"
                          class="form-control mb-3"
                          id="floatingInput"
                          placeholder="Address"
                          v-model="address"
                        />
                        <label for="floatingInput">Address</label>
                      </div>
                    </div>
                    <p v-if="v$.address.$error" class="text-danger">
                      {{ v$.address.$errors[0].$message }}
                    </p>

                    <button
                      type="button"
                      class="btn btn-dark btn-block btn-lg"
                      data-mdb-ripple-color="dark"
                      @click="placeOrder()"
                    >
                      Place Order
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
import { useCookies } from "vue3-cookies";
import useValidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  getCartByUserId,
  postCart,
  removeProductById,
} from "../../api/cart-store";
import { findUser } from "../../api/user-store";
import { getProductById } from "../../api/product-store";
import { postOrder } from "../../api/order-store";

export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      v$: useValidate(),
      products: [],
      price: 0.0,
      isSignedIn: false,
      address: "",
      total: 0.0,
      placedOrder: false,
      orders: []
    };
  },

  validations() {
    return {
      address: {
        required,
      },
    };
  },

  mounted() {
    this.cartProducts();
    this.getStatus();
  },

  methods: {
    getImgUrl(product) {
      // var images = require.context("../assets/", false, /\.(png|jpe?g|gif)$/i);
      // return images("./" + banner.src);
      return "data:image/jpeg;base64," + product.src;
    },

    placeOrder() {
      this.price = 0.0
      this.v$.$validate();
      if (!this.v$.$error) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = today.toLocaleString("default", { month: "short" });
        var yyyy = today.getFullYear();
        today = mm + " " + dd + ", " + yyyy;
        if (this.cookies.isKey("username")) {
          findUser(this.cookies.get("username").email)
            .then((res) => {
              let userData = res.data;
              let prds = [];
              this.products.forEach((p) => {
                let prd = {
                  productId: p.id,
                  quantity: p.quantity,
                  price: p.newPrice,
                };
                prds.push(prd);
              });
              let order = {
                userId: userData[0]._id,
                date: today,
                product: prds,
              };
              postOrder(order)
                .then((res) => {
                  console.log("Order Placed: "+res.data);
                  this.products = [];
                })
                .catch((err) => {
                  return console.log(err.response.data);
                });
            })
            .catch((err) => {
              return console.log(err);
            });
        } else {
          let prds = [];
          this.products.forEach((p) => {
            let prd = {
              productId: p.id,
              quantity: p.quantity,
              price: p.newPrice,
            };
            prds.push(prd);
          });
          let order = {
            randomUserId: this.cookies.get("random").userId,
            date: today,
            product: prds,
            address: this.address,
          };
          postOrder(order)
            .then((res) => {
              console.log(res.data);
              this.products = [];
            })
            .catch((err) => {
              return console.log(err.response.data);
            });
        }
      }
    },

    cartProducts() {
      if (this.cookies.isKey("username")) {
        findUser(this.cookies.get("username").email)
          .then((res) => {
            let userData = res.data;
            getCartByUserId(userData[0]._id)
              .then((res) => {
                let carts = res.data;
                carts.forEach((c) => {
                  getProductById(c.productId).then((res) => {
                    let product = res.data;
                    let p = {
                      id: product._id,
                      title: product.title,
                      type: product.type,
                      oldPrice: product.oldPrice,
                      newPrice: product.newPrice,
                      quantity: c.quantity,
                      src: product.src,
                    };
                    this.products.push(p);
                  });
                });
                this.getPrice();
              })
              .catch((err) => {
                return console.log(err.response.data);
              });
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      } else if (this.cookies.isKey("random")) {
        getCartByUserId(this.cookies.get("random").userId)
          .then((res) => {
            let carts = res.data;
            carts.forEach((c) => {
              getProductById(c.productId).then((res) => {
                let product = res.data;
                let p = {
                  id: product._id,
                  title: product.title,
                  type: product.type,
                  oldPrice: product.oldPrice,
                  newPrice: product.newPrice,
                  quantity: c.quantity,
                  src: product.src,
                };
                this.products.push(p);
              });
            });
            this.getPrice();
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      } else {
        console.log("Cart is empty");
      }
    },

    getStatus() {
      if (this.cookies.isKey("username")) {
        this.address = "nothing";
        return (this.isSignedIn = this.cookies.get("username").status);
      }
      this.address = "";
      return (this.isSignedIn = false);
    },

    removeProduct(id) {
      if (this.cookies.isKey("username")) {
        findUser(this.cookies.get("username").email)
          .then((res) => {
            let userData = res.data;
            removeProductById(userData[0]._id, id)
              .then((res) => {
                if (this.products.find((p) => p.id === id)) {
                  this.products = this.products.filter((p) => p.id !== id);
                  this.getPrice();
                }
              })
              .catch((err) => {
                return console.log(err.response.data);
              });
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      } else {
        removeProductById(this.cookies.get("random").userId, id)
          .then((res) => {
            if (this.products.find((p) => p.id === id)) {
              this.products = this.products.filter((p) => p.id !== id);
              this.getPrice();
            }
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      }
      // this.$store.commit("removeFromCart", val);
    },

    plusQuantity(product) {
      if (this.cookies.isKey("username")) {
        findUser(this.cookies.get("username").email)
          .then((res) => {
            let userData = res.data;
            let cart = {
              userId: userData[0]._id,
              productId: product.id,
              quantity: product.quantity + 1,
            };
            postCart(cart)
              .then((res) => {
                this.products.forEach((p) => {
                  if (p.id == product.id) {
                    p.quantity++;
                    this.getPrice();
                  }
                });
              })
              .catch((err) => {
                return console.log(err.response.data);
              });
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      } else {
        let cart = {
          userId: this.cookies.get("random").userId,
          productId: product.id,
          quantity: product.quantity + 1,
        };
        postCart(cart)
          .then((res) => {
            this.products.forEach((p) => {
              if (p.id == product.id) {
                p.quantity++;
                this.getPrice();
              }
            });
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      }

      // this.$store.commit("plusQuantity", val);
    },

    minusQuantity(product) {
      if (product.quantity == 1) {
        this.removeProduct(product.id);
      } else {
        if (this.cookies.isKey("username")) {
          findUser(this.cookies.get("username").email)
            .then((res) => {
              let userData = res.data;
              let cart = {
                userId: userData[0]._id,
                productId: product.id,
                quantity: product.quantity - 1,
              };
              postCart(cart)
                .then((res) => {
                  this.products.forEach((p) => {
                    if (p.id == product.id) {
                      p.quantity--;
                      this.getPrice();
                    }
                  });
                })
                .catch((err) => {
                  return console.log(err.response.data);
                });
            })
            .catch((err) => {
              return console.log(err.response.data);
            });
        } else {
          let cart = {
            userId: this.cookies.get("random").userId,
            productId: product.id,
            quantity: product.quantity - 1,
          };
          postCart(cart)
            .then((res) => {
              this.products.forEach((p) => {
                if (p.id == product.id) {
                  p.quantity--;
                  this.getPrice();
                }
              });
            })
            .catch((err) => {
              return console.log(err.response.data);
            });
        }
      }

      // this.$store.commit("minusQuantity", val);
    },

    getPrice() {
      this.total = 0.0;
      this.price = 0.0;
      if (this.cookies.isKey("username")) {
        findUser(this.cookies.get("username").email)
          .then((res) => {
            let userData = res.data;
            getCartByUserId(userData[0]._id).then((res) => {
              let carts = res.data;
              carts.forEach((c) => {
                return getProductById(c.productId).then((res) => {
                  let product = res.data;
                  this.total = product.newPrice * c.quantity + this.total;
                  console.log(
                    product.newPrice + " " + c.quantity + " " + this.total
                  );
                  this.getTotal(this.total);
                });
              });
            });
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      } else {
        getCartByUserId(this.cookies.get("random").userId)
          .then((res) => {
            let carts = res.data;
            carts.forEach((c) => {
              return getProductById(c.productId).then((res) => {
                let product = res.data;
                this.total = product.newPrice * c.quantity + this.total;
                console.log(
                  product.newPrice + " " + c.quantity + " " + this.total
                );
                this.getTotal(this.total);
              });
            });
          })
          .catch((err) => {
            return console.log(err.response.data);
          });
      }
    },

    getTotal(total) {
      this.price = total;
      return;
    },
  },
};
</script>

<style>
@media (min-width: 1025px) {
  .h-custom {
    height: 100vh !important;
  }
}

.card-registration .select-input.form-control[readonly]:not([disabled]) {
  font-size: 1rem;
  line-height: 2.15;
  padding-left: 0.75em;
  padding-right: 0.75em;
}

.card-registration .select-arrow {
  top: 13px;
}

.bg-grey {
  background-color: #eae8e8;
}

.image {
  width: 100%;
}

@media (min-width: 992px) {
  .card-registration-2 .bg-grey {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
}

@media (max-width: 991px) {
  .card-registration-2 .bg-grey {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
}
</style>
