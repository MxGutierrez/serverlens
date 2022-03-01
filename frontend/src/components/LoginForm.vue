<template>
  <div
    class="bg-white flex flex-col rounded-md py-6 px-8 space-y-6 w-full max-w-[580px] shadow"
  >
    <div>
      <label for="username" class="block mb-1">Email</label>
      <Input
        id="username"
        :value="username"
        :invalid="usernameError !== null"
        @input="
          usernameError = null;
          $emit('update:username', $event.target.value);
        "
        class="w-full"
      />
      <span v-if="usernameError !== null" class="text-red-500 text-sm mt-1">{{
        usernameError
      }}</span>
    </div>

    <div>
      <label for="password" class="block mb-1">Password</label>
      <Input
        id="password"
        :value="password"
        :invalid="passwordError !== null"
        @input="
          passwordError = null;
          $emit('update:password', $event.target.value);
        "
        @keyup.enter="login"
        type="password"
        class="w-full"
      />
      <span v-if="passwordError !== null" class="text-red-500 text-sm mt-1">{{
        passwordError
      }}</span>
    </div>

    <div>
      <p v-if="error" class="text-red-500 text-sm mb-2">
        {{ error.message.replace(/username/i, "email") }}
      </p>

      <div class="flex space-x-4">
        <Button @click="validate(signUp)" :loading="signingUp" class="flex-1"
          >Sign up</Button
        >
        <Button @click="validate(login)" :loading="loggingIn" class="flex-1"
          >Login</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";

export default {
  components: {
    Input,
    Button,
  },
  props: {
    login: {
      type: Function,
      required: true,
    },
    signUp: {
      type: Function,
      required: true,
    },
    loggingIn: {
      type: Boolean,
      required: true,
    },
    signingUp: {
      type: Boolean,
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    error: {
      type: Object,
      required: false,
    },
  },
  data: () => ({
    usernameError: null,
    passwordError: null,
  }),
  methods: {
    validate(cb) {
      let hasErrors = false;

      if (this.username.length === 0) {
        this.usernameError = "Email field is required";
        hasErrors = true;
      }

      if (this.password.length === 0) {
        this.passwordError = "Password field is required";
        hasErrors = true;
      }

      if (!hasErrors) {
        cb();
      }
    },
  },
};
</script>
