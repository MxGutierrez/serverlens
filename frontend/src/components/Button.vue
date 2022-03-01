<template>
  <button
    class="flex items-center justify-center px-4 h-9 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 text-center"
    :class="{ 'cursor-not-allowed': disabled }"
  >
    <Spinner v-if="loading" class="text-white" />
    <slot v-else />
  </button>
</template>

<script>
import Spinner from "./icons/Spinner";

export default {
  components: {
    Spinner,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
