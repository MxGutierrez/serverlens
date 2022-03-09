<template>
  <Authify
    v-slot="{ signUp, login, logout, signingUp, loggingIn, error }"
    :username="username"
    :password="password"
    @success="handleSuccess"
    @update:cognito-session="updateCognitoSession"
  >
    <div class="px-4 border-b border-gray-200 shadow-sm">
      <div class="container flex items-center justify-between">
        <h1
          style="font-family: Redressed, sans-serif"
          class="text-primary text-[60px]"
        >
          Serverlens
        </h1>

        <div
          v-if="cognitoSession"
          @click="dropdownOpened = !dropdownOpened"
          class="relative flex items-center space-x-2 cursor-pointer"
        >
          <UserIcon class="sm:hidden" />
          <p class="hidden sm:block">
            {{ cognitoSession.idToken.payload.email }}
          </p>
          <ChevronIcon dir="down" class="h-3 w-3" />

          <ul
            v-if="dropdownOpened"
            class="absolute top-[130%] right-0 bg-white rounded-md shadow"
          >
            <li>
              <button @click="logout" class="px-5 py-2">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col py-4 bg-[#f9fafb]">
      <div
        class="container flex-1 flex flex-col"
        :class="{ 'justify-center': cognitoSession === null }"
      >
        <LoginForm
          v-if="cognitoSession === null"
          :login="login"
          :sign-up="signUp"
          :signing-up="signingUp"
          :logging-in="loggingIn"
          v-model:username="username"
          v-model:password="password"
          :error="error"
          class="self-center"
        />

        <template v-else>
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-5"
          >
            <div class="w-full sm:w-1/2">
              <div class="space-x-3 flex-1 flex items-center w-full">
                <Input
                  v-model="website"
                  @input="websiteError = null"
                  @keyup.enter="screenshot"
                  placeholder="www.google.com"
                  :invalid="websiteError !== null"
                  class="flex-1 sm:max-w-[380px]"
                />

                <Button
                  @click="screenshot"
                  :loading="loadings.screencap"
                  :disabled="loadings.screencap"
                  >Screenshot</Button
                >
              </div>

              <span v-if="websiteError" class="text-red-500 text-sm mt-1">{{
                websiteError
              }}</span>
            </div>

            <div class="flex justify-end mt-5 sm:mt-0 items-center space-x-5">
              <button
                @click="listScreenshots"
                class="p-2 rounded-full bg-white border border-gray-200"
              >
                <RefreshIcon
                  :class="{ 'animate-spin-reverse': loadings.list }"
                />
              </button>
              <Filter :items="['Completed', 'Pending']" v-model="filter" />
            </div>
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

            <template v-else>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <Screencap
                  v-for="(result, index) in results?.Items"
                  :key="result.Path"
                  :screencap="result"
                  @deleted="results.Items.splice(index, 1)"
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
            </template>
          </div>
        </template>
      </div>
    </div>
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
import RefreshIcon from "./components/icons/Refresh.vue";
import ChevronIcon from "./components/icons/Chevron.vue";
import UserIcon from "./components/icons/User.vue";
import LoginForm from "./components/LoginForm.vue";

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
    ChevronIcon,
    RefreshIcon,
    UserIcon,
    LoginForm,
  },
  data: () => ({
    username: "",
    password: "",
    cognitoSession: null,

    website: "",
    websiteError: null,

    results: null,
    loadings: {
      screencap: false,
      list: false,
      listMore: false,
    },
    filter: "Completed",
    dropdownOpened: false,
  }),
  methods: {
    handleSuccess() {
      this.username = "";
      this.password = "";
    },
    async screenshot() {
      if (!/^www\.[a-zA-Z-._]{2,256}\.[a-z]{2,6}$/.test(this.website)) {
        this.websiteError = "Make sure the url has the correct format";
        return;
      }
      this.websiteError = null;

      try {
        this.loadings.screencap = true;

        await axios.post("/screencaps", {
          website: this.website,
        });

        this.website = "";
        this.filter = "Pending";
        this.listScreenshots();
      } finally {
        this.loadings.screencap = false;
      }
    },
    async listScreenshots() {
      try {
        if (this.loadings.list) {
          return;
        }

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
        if (this.loadings.listMore) {
          return;
        }

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
    updateCognitoSession(session) {
      this.cognitoSession = session;

      if (session && this.results === null) {
        this.listScreenshots();
      } else {
        this.results = null;
      }
    },
  },
  watch: {
    filter: "listScreenshots",
  },
};
</script>
