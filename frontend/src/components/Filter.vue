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
      <Component
        v-if="item.icon"
        :is="iconToComponent[item.icon]"
        class="w-6 h-6"
      />
      <template v-else>
        {{ item.label }}
      </template>
    </button>
  </div>
</template>

<script>
const iconToComponent = {
  star: "StarIcon",
};

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
  data: () => ({
    iconToComponent,
  }),
};
</script>
