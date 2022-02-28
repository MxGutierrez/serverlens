<template>
  <div
    class="block rounded-md overflow-hidden shadow group"
    :class="{ 'opacity-30': deleting }"
  >
    <div class="w-full h-60 relative overflow-hidden">
      <img :src="imageUrl" class="w-full object-cover h-full object-top" />

      <a
        :href="screencap.Website"
        target="__blank"
        class="absolute flex items-center -bottom-[32px] left-0 opacity-0 group-hover:opacity-100 group-hover:bottom-0 bg-primary text-white text-sm transition-all duration-200 ease-out py-1 px-3 rounded-t-lg ml-3"
      >
        {{ website }}
        <ExternalLinkIcon class="h-3 w-3 ml-2" />
      </a>
    </div>

    <div class="p-4 flex justify-between">
      <p>{{ date }}</p>

      <div class="flex items-center space-x-3">
        <a :href="imageUrl" download>
          <DownloadIcon class="h-6 w-6 text-gray-300 hover:text-gray-500" />
        </a>

        <TrashIcon
          @click.prevent="handleDelete"
          class="text-gray-300 h-6 w-6 cursor-pointer"
          :class="{ 'hover:text-red-600': !deleting }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TrashIcon from "./icons/Trash.vue";
import ExternalLinkIcon from "./icons/ExternalLink.vue";
import DownloadIcon from "./icons/Download.vue";

import axios from "axios";
import dayjs from "dayjs";

export default {
  components: {
    TrashIcon,
    ExternalLinkIcon,
    DownloadIcon,
  },
  props: {
    screencap: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    deleting: false,
  }),
  computed: {
    imageUrl() {
      return `${process.env.VUE_APP_SCREENCAP_URL}/${this.screencap.Path}`;
    },
    date() {
      return dayjs(this.screencap.Date.split("#")[1]).fromNow();
    },
    website() {
      return this.screencap.Website.replace(/^https?:\/\//, "");
    },
  },
  methods: {
    async handleDelete() {
      if (this.deleting) {
        return;
      }

      try {
        this.deleting = true;

        await axios.delete(
          `/screencaps/${encodeURIComponent(this.screencap.Date)}`
        );

        this.$emit("deleted");
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>
