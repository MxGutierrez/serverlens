<template>
  <div
    class="space-x-2 border border-gray-200 rounded-lg p-3 bg-white text-sm font-semibold flex items-center"
  >
    <button
      v-for="item in items"
      :key="item"
      @click="$emit('update:modelValue', item.id)"
      class="rounded-md focus:ring-primary h-9 px-3"
      :class="{ 'text-white bg-primary font-semibold': modelValue === item.id }"
    >
      <StarIcon
        v-if="item.label === 'Bookmarks'"
        class="text-yellow-400 w-6 h-6"
        :filled="true"
      />

      <template v-else>
        {{ item.label }}
      </template>
    </button>
  </div>
</template>

<script>
import StarIcon from "./icons/Star";

export default {
  components: {
    StarIcon,
  },
  emits: ["update:modelValue"],
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
};
</script>
