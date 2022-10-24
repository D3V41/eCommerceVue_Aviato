<template>
  <div>
    <form @submit.prevent="submit">
      <div class="row">
        <div class="col-md-2" />
        <div class="col-md-3 grid-col">Name</div>
        <div class="col-md-5 themed-grid-col">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            v-model="name"
            :disabled="true"
          />
        </div>
        <div class="col-md-2" />
      </div>
      <div class="row">
        <div class="col-md-2" />
        <div class="col-md-3 grid-col">Email</div>
        <div class="col-md-5 themed-grid-col">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            v-model="email"
            :disabled="true"
          />
        </div>
        <div class="col-md-2" />
      </div>
      <!-- <div class="row">
        <div class="col-md-2" />
        <div class="col-md-3 grid-col">Password</div>
        <div class="col-md-5 themed-grid-col" style="display: flex;align-items: center;">
         <div class="control is-expanded col-md-11">
          <input v-if="showPassword" type="text" class="form-control" v-model="password" :disabled="true"/>
           <input v-else type="password" class="form-control" v-model="password" :disabled="true">
         </div>
          <div class="control col-md-1" >
            <button class="btn btn-light" @click="toggleShow">
            <img src="../assets/eye.png" class="d-block w-100 " alt="eye" />
          </button>
          </div>

        </div>
        <div class="col-md-2" />
      </div>-->
      <div class="row">
        <div class="col-md-12">
          <b>Address</b>
        </div>
      </div>
      <div class="row">
        <div class="col-md-2" />
        <div class="col-md-3 grid-col">Street</div>
        <div class="col-md-5 themed-grid-col">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            v-model="street"
            :disabled="isEnableEditing"
          />
        </div>
        <div class="col-md-2" />
      </div>
      <div class="row">
        <div class="col-md-2" />
        <div class="col-md-3 grid-col">City</div>
        <div class="col-md-5 themed-grid-col">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            v-model="city"
            :disabled="isEnableEditing"
          />
        </div>
        <div class="col-md-2" />
      </div>
      <div class="row">
        <div class="col-md-2" />
        <div class="col-md-3 grid-col">Province</div>
        <div class="col-md-5 themed-grid-col">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            v-model="province"
            :disabled="isEnableEditing"
          />
        </div>
        <div class="col-md-2" />
      </div>
      <div class="row">
        <div class="col-md-2" />
        <div class="col-md-3 grid-col">Country</div>
        <div class="col-md-5 themed-grid-col">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            v-model="country"
            :disabled="isEnableEditing"
          />
        </div>
        <div class="col-md-2" />
      </div>

      <button class="btn btn-outline-primary b-edit" @click="enableEdit">Edit</button>
      <button class="btn btn-success b-update" @click="update">Update</button>
    </form>
    <div class="mb-2" />
  </div>
</template>

<script>
import { findUser, updateUser } from "../../api/user-store.js";
import { useCookies } from "vue3-cookies";

export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      id: "",
      email: "",
      name: "",
      street: "",
      city: "",
      province: "",
      country: "",
      editProfile: true,
      showPassword: false,
    };
  },

  mounted() {
    this.editProfile = this.$store.getters.getProfileEdit;
    findUser(this.cookies.get("username").email)
      .then((res) => {
        let userdata = res.data[0];
        this.id = userdata._id;
        this.name = userdata.name;
        this.email = userdata.email;
        this.street = userdata.address.street;
        this.city = userdata.address.city;
        this.province = userdata.address.province;
        this.country = userdata.address.country;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  methods: {
    update() {
      this.$store.commit("changedEditProfile", true);
      console.log(this.id)
      let user = {
        id: this.id,
        address: {
          street: this.street,
          city: this.city,
          province: this.province,
          country: this.country,
        },
      };
      updateUser(user)
        .then((res) => {
          console.log("updated");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    toggleShow() {
      this.showPassword = !this.showPassword;
    },

    enableEdit() {
      this.$store.commit("changedEditProfile", false);
    },
  },

  computed: {
    isEnableEditing() {
      this.editProfile = this.$store.getters.getProfileEdit;
      return this.editProfile;
    },

    buttonLabel() {
      return this.showPassword ? "Hide" : "Show";
    },
  },
};
</script>

<style>
.row {
  margin: 1%;
}

.grid-col {
  background-color: rgba(86, 61, 124, 0.15);
  border: 1px solid rgba(86, 61, 124, 0.2);
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.themed-grid-col {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background-color: rgba(86, 61, 124, 0.15);
  border: 1px solid rgba(86, 61, 124, 0.2);
}

.themed-container {
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: rgba(0, 123, 255, 0.15);
  border: 1px solid rgba(0, 123, 255, 0.2);
}

.b-edit {
  width: 150px;
  margin-right: 10px;
}
.b-update {
  width: 150px;
}
</style>
