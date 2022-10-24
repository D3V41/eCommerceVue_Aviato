<template>
  <div class="form-signin w-100 m-auto">
    <form>
      <img class="mb-4" src="../assets/logo.png" alt width="72" height="57" />
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          placeholder="name@example.com"
          style="margin-bottom: 3px"
          v-model="email"
        />
        <label for="floatingInput">Email address</label>
      </div>
      <p v-if="v$.email.$error" class="text-danger">{{ v$.email.$errors[0].$message }}</p>

      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          style="margin-bottom: 10px"
          v-model="password"
        />
        <label for="floatingPassword">Password</label>
      </div>
      <p v-if="v$.password.$error" class="text-danger">{{ v$.password.$errors[0].$message }}</p>

      <button
        class="w-100 btn btn-lg btn-primary"
        type="submit"
        @click="changedStatus(true)"
      >Sign in</button>
    </form>
    <p v-if="isError" class="text-danger mt-3">{{ errorMsg }}</p>
  </div>
</template>

<script>
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { loginUser, findUser } from "../../api/user-store.js";
import { useCookies } from "vue3-cookies";

export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      v$: useValidate(),
      email: "",
      password: "",
      isSignedIn: false,
      errorMsg: "",
      isError: false,
    };
  },

  validations() {
    return {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    };
  },

  mounted() {
    this.isSignedIn = this.$store.getters.getLoginStatus;
  },

  methods: {
    changedStatus(status) {
      this.v$.$validate();
      if (!this.v$.$error) {
        let user = {
          email: this.email,
          password: this.password,
        };
        loginUser(user)
          .then((res) => {
            this.isError = false
            if (!this.cookies.isKey("username")) {
              findUser(this.email).then((res) => {
                let userdata = res.data[0];
                this.cookies.set("username", {
                  name: userdata.name,
                  email: this.email,
                  status,
                });
              });
            }
            this.$store.commit("changedSignedin");
            this.$router.push("/").then(() => {
              this.$router.go(0);
            });
          })
          .catch((error) => {
            this.isError = true
            this.errorMsg = "Email or Password is wrong"
            console.log(error);
          });
      } else {
        console.log("Form failed validation");
      }
    },
  },
};
</script>

<style>
.form-signin {
  max-width: 350px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}
</style>
