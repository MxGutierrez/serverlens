<template>
  <svg
    v-if="dir === 'down'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
</template>

<script>
export default {
  props: {
    dir: {
      type: String,
      required: true,
    },
  },
};
</script>
