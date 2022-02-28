<template>
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
      <div class="flex-1 flex flex-col p-4">
        <div>
          <Input v-model="website" placeholder="www.google.com" />

          <Button
            @click="screenshot"
            :loading="loadings.screencap"
            :disabled="loadings.screencap"
            >Screenshot</Button
          >
        </div>

        <div class="flex justify-end mb-5">
          <Filter :items="['Completed', 'Pending']" v-model="filter" />
        </div>

        <div class="flex-1 w-full flex flex-col">
          <Loader
            v-if="loadings.list"
            class="flex justify-center items-center flex-1"
          />

          <div
            v-else-if="results?.Items?.length === 0"
            class="flex justify-center items-center flex-1"
          >
            <p>No screenshots to show</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            <Screencap
              v-for="(result, index) in results?.Items"
              :key="result.Path"
              :screencap="result"
              @deleted="results.splice(index, 1)"
            />
          </div>

          <div
            v-if="results?.LastEvaluatedKey"
            class="flex items-center justify-center mt-3 text-primary"
          >
            <Spinner v-if="loadings.listMore" class="my-1" />
            <button v-else @click="loadMore" class="px-3 py-1">
              Load more
            </button>
          </div>
        </div>
      </div>
    </template>
  </Authify>
</template>

<script>
import Authify from "./components/Authify.vue";
import Button from "./components/Button.vue";
import Input from "./components/Input.vue";
import Filter from "./components/Filter.vue";
import Screencap from "./components/Screencap.vue";
import Loader from "./components/Loader.vue";
import Spinner from "./components/icons/Spinner.vue";

import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  components: {
    Authify,
    Button,
    Input,
    Filter,
    Screencap,
    Loader,
    Spinner,
  },
  data: () => ({
    username: "",
    password: "",
    cognitoSession: null,
    error: null,
    website: "",
    results: null,
    loadings: {
      screencap: false,
      list: false,
      listMore: false,
    },
    filter: "Completed",
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
      try {
        this.loadings.screencap = true;

        await axios.post("/screencaps", {
          website: `http://${this.website}`,
        });

        this.website = "";
      } finally {
        this.loadings.screencap = false;
      }
    },
    async listScreenshots() {
      try {
        this.loadings.list = true;
        const { data } = await axios.get("/screencaps", {
          params: {
            status: this.filter,
          },
        });

        this.results = data;
      } finally {
        this.loadings.list = false;
      }
    },
    async loadMore() {
      try {
        this.loadings.listMore = true;
        const { data } = await axios.get("/screencaps", {
          params: {
            status: this.filter,
            cursor: this.results.LastEvaluatedKey,
          },
        });

        this.results = {
          Items: [...this.results.Items, ...data.Items],
          LastEvaluatedKey: data.LastEvaluatedKey,
        };
      } finally {
        this.loadings.listMore = false;
      }
    },
  },
  watch: {
    filter: {
      handler: "listScreenshots",
      // immediate: true // not authenticated at this point
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
