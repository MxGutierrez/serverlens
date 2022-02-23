<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <label for="username">Email</label>
    <input v-model="username" id="username" />

    <label for="password">Password</label>
    <input v-model="password" type="password" id="password" />

    <button @click="signUp">Signup</button>
    <button @click="login">Login</button>
  </div>
</template>

<script>
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: process.env.VUE_APP_USER_POOL_ID,
  ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID,
});

export default {
  name: "App",
  data: () => ({
    username: "",
    password: "",
  }),
  methods: {
    signUp() {
      userPool.signUp(this.username, this.password, [], null, (err, result) => {
        console.log("sign up ", err, result);
      });
    },
    login() {
      const cognitoUser = new CognitoUser({
        Username: this.username,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: this.username,
        Password: this.password,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          console.log("onSuccess", result);
          console.log(
            "access token + " + result.getAccessToken().getJwtToken()
          );
        },
        onFailure: (err) => {
          console.log("onFailure", err);
        },
      });
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
