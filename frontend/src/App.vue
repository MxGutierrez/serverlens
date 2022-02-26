<template>
  <img alt="Vue logo" src="./assets/logo.png" />

  <Authify
    v-slot="{ signUp, login, logout }"
    :username="username"
    :password="password"
    @success="handleSuccess"
    @error="handleError"
    @update:cognito-session="cognitoSession = $event"
  >
    <template v-if="cognitoSession === null">
      <label for="username">Email</label>
      <input v-model="username" id="username" />

      <label for="password">Password</label>
      <input v-model="password" type="password" id="password" />

      <button @click="signUp">Signup</button>
      <button @click="login">Login</button>
    </template>

    <template v-else>
      <button @click="logout">Logout</button>
      <input v-model="website" />
      <button @click="screenshot">Screenshot</button>
    </template>
  </Authify>
</template>

<script>
import Authify from "./components/Authify.vue";

import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  components: {
    Authify,
  },
  data: () => ({
    username: "",
    password: "",
    cognitoSession: null,
    error: null,
    website: "",
  }),
  methods: {
    handleSuccess() {
      this.username = "";
      this.password = "";
    },
    handleError(error) {
      console.log(error);
    },
    async screenshot() {
      const { data } = await axios.post("/screencap", {
        website: this.website,
      });

      console.log(data);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
