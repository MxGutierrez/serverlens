<template>
  <slot
    :sign-up="signUp"
    :login="login"
    :logout="logout"
    :signing-up="signingUp"
    :logging-in="loggingIn"
    :error="error"
  ></slot>
</template>

<script>
// Auth logic from this component could be moved to api gateway endpoint
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
  data: () => ({
    loggingIn: false,
    signingUp: false,
    signedUp: false,
    error: null,
  }),
  created() {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          this.logout();
        }
        throw error;
      }
    );

    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
      currentUser.getSession((err, session) => {
        axios.defaults.headers.common["Authorization"] =
          session.idToken.jwtToken;

        this.$emit(
          "update:cognito-session",
          currentUser.getSignInUserSession()
        );
      });
    }
  },
  methods: {
    signUp() {
      if (this.signingUp || this.loggingIn) {
        return;
      }

      this.error = null;

      this.signingUp = true;

      userPool.signUp(
        this.username,
        this.password,
        [],
        null,
        async (err, result) => {
          console.log("sign up ", err, result);
          if (err) {
            this.error = err;
          } else {
            this.signedUp = true;
            await this.login();
            this.signedUp = true;
          }

          this.signingUp = false;
        }
      );
    },
    login() {
      if ((this.signingUp && !this.signedUp) || this.loggingIn) {
        return;
      }

      if (!this.signedUp) {
        this.loggingIn = true;
      }

      this.error = null;

      const cognitoUser = new CognitoUser({
        Username: this.username,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: this.username,
        Password: this.password,
      });

      return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
          onSuccess: (result) => {
            axios.defaults.headers.common["Authorization"] =
              result.idToken.jwtToken;

            this.$emit("update:cognito-session", result);

            this.$emit("success");

            this.loggingIn = false;

            resolve();
          },
          onFailure: (error) => {
            this.error = error;
            this.loggingIn = false;

            reject();
          },
        });
      });
    },
    logout() {
      delete axios.defaults.headers.common["Authorization"];

      try {
        userPool.getCurrentUser().signOut();
      } finally {
        this.$emit("update:cognito-session", null);
      }
    },
  },
};
</script>
