<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="border border-gray-300 rounded-md focus:ring-primary h-9 px-3"
  />
</template>

<script>
export default {
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      required: false,
    },
  },
};
</script>
