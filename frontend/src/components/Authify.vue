<template>
  <slot :sign-up="signUp" :login="login" :logout="logout"></slot>
</template>

<script>
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

import axios from "axios";

const userPool = new CognitoUserPool({
  UserPoolId: process.env.VUE_APP_USER_POOL_ID,
  ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID,
});

export default {
  props: {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  emits: ["success", "error", "update:cognito-session"],
  created() {
    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
      currentUser.getSession((err, session) => {
        this.$emit("update:cognito-session", currentUser);

        axios.defaults.headers.common["Authorization"] =
          session.idToken.jwtToken;
      });
    }
  },
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
          this.$emit("update:cognito-session", result);

          axios.defaults.headers.common["Authorization"] =
            result.idToken.jwtToken;

          this.$emit("success");
        },
        onFailure: (err) => {
          this.$emit("error", err);
        },
      });
    },
    logout() {
      delete axios.defaults.headers.common["Authorization"];

      userPool.getCurrentUser().signOut();

      this.$emit("update:cognito-session", null);
    },
  },
};
</script>
