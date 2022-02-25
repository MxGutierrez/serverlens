<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Authify
    v-if="cognitoSession === null"
    v-slot="{ signUp, login }"
    :username="username"
    :password="password"
    @success="handleSuccess"
    @error="handleError"
  >
    <label for="username">Email</label>
    <input v-model="username" id="username" />

    <label for="password">Password</label>
    <input v-model="password" type="password" id="password" />

    <button @click="signUp">Signup</button>
    <button @click="login">Login</button>
  </Authify>

  <button v-else @click="cognitoSession = null">Logout</button>

  <button @click="request">Request</button>
  <p>Response: {{ response }}</p>
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
    response: "",
  }),
  methods: {
    handleSuccess(result) {
      this.cognitoSession = result;
      this.username = "";
      this.password = "";

      // console.log(this.cognitoSession.idToken.jwtToken);
      axios.defaults.headers.common["Authorization"] =
        this.cognitoSession.idToken.jwtToken;
    },
    handleError(error) {
      console.log(error);
    },
    async request() {
      const { data } = await axios.get("/");
      this.response = data;
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
