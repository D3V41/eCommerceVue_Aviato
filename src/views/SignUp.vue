<template>
  <div class="form-signin w-100 m-auto">
    <form>
      <img class="mb-4" src="../assets/logo.png" alt width="72" height="57" />
      <h1 class="h3 mb-3 fw-normal">Create a new account</h1>

      <div class="form-floating">
        <input type="text" class="form-control" placeholder="Contact" v-model="name" />
        <label for="floatingInput">Name</label>
      </div>
      <p v-if="v$.name.$error" class="text-danger">{{ v$.name.$errors[0].$message }}</p>

      <div class="form-floating">
        <input type="email" class="form-control" placeholder="name@example.com" v-model="email" />
        <label for="floatingInput">Email address</label>
      </div>
      <p v-if="v$.email.$error" class="text-danger">{{ v$.email.$errors[0].$message }}</p>

      <div class="form-floating">
        <input type="password" class="form-control" placeholder="Password" v-model="password" />
        <label for="floatingPassword">Password</label>
      </div>
      <p v-if="v$.password.$error" class="text-danger">{{ v$.password.$errors[0].$message }}</p>

      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          placeholder="Confirm Password"
          v-model="confirmPassword"
        />
        <label for="floatingPassword">Confirm Password</label>
      </div>
      <p
        v-if="v$.confirmPassword.$error"
        class="text-danger"
      >{{ v$.confirmPassword.$errors[0].$message }}</p>

      <div class="form-floating">
        <input type="text" class="form-control" placeholder="Street" v-model="street" />
        <label for="floatingInput">Street</label>
      </div>
      <p v-if="v$.street.$error" class="text-danger">{{ v$.street.$errors[0].$message }}</p>

      <div class="form-floating">
        <input type="text" class="form-control" placeholder="City" v-model="city" />
        <label for="floatingInput">City</label>
      </div>
      <p v-if="v$.city.$error" class="text-danger">{{ v$.city.$errors[0].$message }}</p>

      <div class="form-floating">
        <input type="text" class="form-control" placeholder="Province" v-model="province" />
        <label for="floatingInput">Province</label>
      </div>
      <p v-if="v$.province.$error" class="text-danger">{{ v$.province.$errors[0].$message }}</p>

      <div class="form-floating">
        <input type="text" class="form-control" placeholder="Country" v-model="country" />
        <label for="floatingInput">Country</label>
      </div>
      <p v-if="v$.country.$error" class="text-danger">{{ v$.country.$errors[0].$message }}</p>

      <button
        class="w-100 btn btn-lg btn-primary"
        type="submit"
        @click="changedStatus(true)"
      >Register</button>
    </form>
  </div>
</template>

<script>
import useValidate from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";
import { postUser } from "../../api/user-store.js";
import { useCookies } from "vue3-cookies";

const validPassword = (val) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  let result;
  if ((result = regex.exec(val)) == null) {
    return false;
  }
  return true;
};

export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      street: "",
      city: "",
      province: "",
      country: "",
      isSignedIn: false,
    };
  },

  validations() {
    return {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(8),
        validPassword: helpers.withMessage(
          "Password must include one lowercase character, one uppercase character, a number",
          validPassword
        ),
      },
      confirmPassword: {
        sameAsPassword: sameAs(this.password),
      },
      street: {
        required,
      },
      city: {
        required,
      },
      province: {
        required,
      },
      country: {
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
          name: this.name,
          email: this.email,
          password: this.password,
          address: {
            street: this.street,
            city: this.city,
            province: this.province,
            country: this.country,
          },
        };
        postUser(user)
          .then((res) => {
            this.cookies.set("username", {
              name: this.name,
              email: this.email,
              status,
            });
            this.$store.commit("changedSignedin");
            this.$router.push("/").then(() => {
              this.$router.go(0);
            });
          })
          .catch((error) => {
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
  max-width: 500px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin .form-floating {
  margin-bottom: 3px;
}

.form-signin input[type="text"] {
  margin-bottom: 10px;
}
</style>
