<template>
  <slot :sign-up="signUp" :login="login"></slot>
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
  emits: ["success", "error"],
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
          this.$emit("success", result);
        },
        onFailure: (err) => {
          this.$emit("error", err);
        },
      });
    },
  },
};
</script>
