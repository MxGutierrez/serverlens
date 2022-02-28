<template>
  <div class="space-x-3 border border-gray-200 rounded-lg p-2">
    <button
      v-for="item in items"
      :key="item"
      @click="$emit('update:modelValue', item)"
      class="rounded-md focus:ring-primary h-9 px-3"
      :class="{ 'text-white bg-primary': modelValue === item }"
    >
      {{ item }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
};
</script>
