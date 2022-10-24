<template>
  <section style="background-color: #eee">
    <div class="container py-5">
      <div class="row d-flex justify-content-center">
        <div class="col-md-12 col-lg-10">
          <div class="card text-dark">
            <div class="card-body p-4">
              <div class="py-5 text-dark" style>
                <h4 class="fw-bold mb-0">Reviews</h4>
                <div class="d-flex flex-start w-100">
                  <div class="w-100 p-top">
                    <h5>Post a Review</h5>

                    <div class="form-outline">
                      <textarea
                        class="form-control"
                        id="textAreaExample"
                        placeholder="Enter review"
                        v-model="review"
                        rows="4"
                      ></textarea>
                    </div>
                    <p v-if="v$.review.$error" class="text-danger">
                      {{ v$.review.$errors[0].$message }}
                    </p>
                    <div class="mb-3">
                      <label for="formFile" class="form-label"
                        >Upload Photo</label
                      >

                      <input
                        class="form-control"
                        ref="preImage"
                        type="file"
                        accept="image/*"
                        id="formFile"
                        @change="uploadImage"
                      />
                      <img :src="previewImage" class="uploading-image" />
                    </div>
                    <p v-if="isError" class="text-danger mt-3">
                      {{ errorMsg }}
                    </p>

                    <div class="d-flex justify-content-between mt-3">
                      <button
                        type="button"
                        class="btn btn-success"
                        @click="uploadReview"
                      >
                        Post
                        <img
                          src="../assets/send.png"
                          alt="icon"
                          style="width: 20px; height: 17px; margin-left: 4px"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="review in reviews" :key="review.id">
              <div v-if="review.productId == $route.params.id">
                <div class="d-flex flex-start p-4">
                  <img
                    class="rounded-circle shadow-1-strong me-3"
                    src="../assets/profile.png"
                    alt="avatar"
                    width="50"
                    height="50"
                  />
                  <div>
                    <h6 class="fw-bold mb-1">{{ review.userName }}</h6>
                    <div class="d-flex align-items-center mb-3">
                      <p class="mb-0 date">{{ review.date }}</p>
                    </div>
                    <img
                      :src="getImgUrl(review)"
                      class="photo-size"
                      :alt="review.id"
                    />
                    <p class="mb-0">{{ review.review }}</p>
                  </div>
                </div>
                <hr class="my-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { postReview, getReviewByProduct } from "../../api/review-store.js";
import useValidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useCookies } from "vue3-cookies";
import { findUser } from "../../api/user-store";

export default {
  props: ["id"],
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      v$: useValidate(),
      userId: 0,
      review: "",
      reviews: [],
      isSignedIn: false,
      previewImage: "",
      review: null,
      isError: false,
      errorMsg: "",
    };
  },

  validations() {
    return {
      review: {
        required,
      },
    };
  },

  mounted() {
    this.reviews = this.$store.getters.getReviews;
    this.isSignedIn = this.$store.getters.getLoginStatus;
    getReviewByProduct(this.id)
      .then((res) => {
        this.reviews = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    getImgUrl(banner) {
      // var images = require.context("../assets/", false, /\.(png|jpe?g|gif)$/i);
      // return images("./" + banner.src);
      return "data:image/jpeg;base64," + banner.src;
    },

    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
    },

    uploadReview(e) {
      this.v$.$validate();
      if (!this.v$.$error) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = today.toLocaleString("default", { month: "short" });
        var yyyy = today.getFullYear();
        today = mm + " " + dd + ", " + yyyy;
        var imgSrc = this.previewImage.replace(
          /^data:image\/[a-z]+;base64,/,
          ""
        );
        let review = {};
        if (!this.cookies.isKey("username")) {
          review = {
            productId: this.id,
            date: today,
            userName: "Anonymous" + Math.random() * 100000000000000000,
            review: this.review,
            src: imgSrc,
          };
          postReview(review)
            .then((res) => {
              this.isError = false;
              getReviewByProduct(this.id)
                .then((res) => {
                  this.reviews = res.data;
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              if (err.response.data.error) {
                console.log(err.response.data.error[0]);
                this.isError = true;
                this.errorMsg = "Please upload pic";
                return;
              }
              console.log(err.response.data);
              this.isError = true;
              this.err;
            });
        } else {
          findUser(this.cookies.get("username").email)
            .then((res) => {
              let userdata = res.data[0];
              review = {
                userId: userdata._id,
                productId: this.id,
                date: today,
                userName: userdata.name,
                review: this.review,
                src: imgSrc,
              };
              postReview(review)
                .then((res) => {
                  this.isError = false;
                  getReviewByProduct(this.id)
                    .then((res) => {
                      this.reviews = res.data;
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  if (err.response.data.error) {
                    console.log(err.response.data.error[0]);
                    this.isError = true;
                    this.errorMsg = "Please upload pic";
                    return;
                  }
                  console.log(err.response.data);
                  this.isError = true;
                  this.errorMsg = err.response.data;
                  return;
                });
            })
            .catch((err) => {
              console.log(err);
              return;
            });
        }

        // this.$store.commit("postReview", review);
        // this.reviews = this.$store.getters.getReviews;
      } else {
        console.log("failed");
      }
    },
  },
};
</script>

<style scoped>
.uploading-image {
  width: 200px;
  margin-top: 1rem;
}

.py-5 {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.p-top {
  padding-top: 1rem;
}

.mb-1 {
  text-align: left;
}

.mb-3 {
  margin-top: 1rem;
  text-align: left;
}

.mb-0 {
  text-align: left;
}

.photo-size {
  width: 200px;
  margin-bottom: 10px;
}

.date {
  margin-top: -0.75rem;
}
</style>
