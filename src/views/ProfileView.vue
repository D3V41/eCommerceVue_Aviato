<template>
  <div>
    <h1>Profile</h1>
    <ProfilePage />
  </div>
</template>

<script>
import ProfilePage from "../components/ProfilePage.vue";

export default {
  name: "ProfileView",
  components: {
    ProfilePage,
  },
};
</script>
