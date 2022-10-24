<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-light bg-gradiant">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="../assets/logo.png" alt="Aviato" width="30" height="30" />
        </a>
        <button
          class="navbar-toggler navbar-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active link-secondary" aria-current="page" href="#">
                <router-link to="/">Home</router-link>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link link-dark" href="#">
                <router-link to="/products">Products</router-link>
              </a>
            </li>
          </ul>

          <div v-if="this.isSignedIn">
            <div class="dropdown text-end navbar-text">
              <a
                href="#"
                class="d-block link-dark text-decoration-none dropdown-toggle"
                id="dropdownUser1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="../assets/profile.png"
                  alt="profile"
                  width="32"
                  height="32"
                  style="display: inline"
                  class="rounded-circle m-right"
                />
                <div
                  class="username"
                  style="display: inline; white-space: nowrap"
                >{{this.username}}</div>
              </a>
              <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                <li>
                  <a class="dropdown-item" style="display: inline-block" href="#">
                    <img
                      src="../assets/cart.png"
                      alt="profile"
                      width="22"
                      height="22"
                      style="display: inline"
                    />
                    <div
                      class="username"
                      style="
                        display: inline;
                        white-space: nowrap;
                        margin-left: 15px;
                      "
                    >
                      <router-link to="/cart">Cart</router-link>
                    </div>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" style="display: inline-block" href="#">
                    <img
                      src="../assets/person.png"
                      alt="profile"
                      width="22"
                      height="22"
                      style="display: inline"
                    />
                    <div
                      class="username"
                      style="
                        display: inline;
                        white-space: nowrap;
                        margin-left: 15px;
                      "
                    >
                      <router-link to="/profile">Profile</router-link>
                    </div>
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" style="display: inline-block" href="#">
                    <img
                      src="../assets/logout.png"
                      alt="profile"
                      width="22"
                      height="22"
                      style="display: inline"
                    />
                    <div
                      class="username"
                      style="
                        display: inline;
                        white-space: nowrap;
                        margin-left: 10px;
                      "
                      @click="signedOut(false)"
                    >Sign out</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <div class="text-end">
              <router-link to="/login">
                <button type="button" class="btn btn-outline-dark me-2">Login</button>
              </router-link>
              <router-link to="/signUp">
                <button type="button" class="btn btn-dark text-white">Sign-Up</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";

export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      isSignedIn: false,
      username: "",
    };
  },

  mounted() {
    this.isSignedIn = this.$store.getters.getLoginStatus;
    this.username = this.getUsername();
  },

  methods: {
    signedOut(status) {
      this.cookies.remove("username");
      this.$store.commit("changedSignedin", status);
      this.$router.go(0);
      this.$router.push("/");
    },
    getStatus() {
      const cookie = this.cookies.get("username");
      if (cookie) {
        console.log(cookie.status)
        return cookie.status;
      }
      console.log("cookie.status")
      return false
    },
    getUsername() {
      const cookie = this.cookies.get("username");
      if (cookie) {
        return cookie.name;
      }
      return ""
    },
  },

  
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.router-link-active {
  color: #0d6efd;
}

.m-right {
  margin-right: 5px;
}
</style>
