<template>
  <div
    class="block rounded-md overflow-hidden shadow group"
    :class="{ 'opacity-30': deleting }"
  >
    <template v-if="screencap.Date.split('#')[0] === 'COMPLETED'">
      <div class="w-full h-60 relative overflow-hidden">
        <img :src="imageUrl" class="w-full object-cover h-full object-top" />

        <a
          :href="screencap.Website"
          target="__blank"
          class="absolute flex items-center bottom-0 sm:-bottom-[32px] left-0 sm:opacity-0 group-hover:opacity-100 group-hover:bottom-0 bg-primary text-white text-sm transition-all duration-200 ease-out py-1 px-3 rounded-t-lg ml-3"
        >
          {{ screencap.Website }}
          <ExternalLinkIcon class="h-3 w-3 ml-2" />
        </a>
      </div>

      <div class="p-4 flex items-center justify-between bg-white">
        <p class="text-sm">{{ date }}</p>

        <div class="flex items-center space-x-3">
          <a :href="imageUrl" download>
            <DownloadIcon class="h-6 w-6 text-gray-300 hover:text-primary" />
          </a>

          <TrashIcon
            @click="handleDelete"
            class="text-gray-300 h-6 w-6 cursor-pointer"
            :class="{ 'hover:text-red-500': !deleting }"
          />
        </div>
      </div>
    </template>

    <div
      v-else
      class="rounded-md bg-white p-3 flex justify-between shadow"
      :class="{ 'bg-red-50': hasFailed }"
    >
      <div class="overflow-hidden">
        <div class="flex items-center">
          <p>{{ hasFailed ? "Failed" : "In progress" }}</p>
          <Popper placement="top" :hover="true" :arrow="true" offset-skid="20">
            <AlertIcon v-if="hasFailed" class="h-4 w-4 opacity-50 ml-2" />
            <template #content>
              <div
                class="bg-zinc-400 px-3 py-2 rounded-md max-w-[250px] ml-2 text-xs text-white"
              >
                This was probably due to an error in the url provided. Make sure
                the website is accessible and try again!
              </div>
            </template>
          </Popper>
        </div>
        <p class="text-sm truncate">{{ screencap.Website }}</p>
      </div>

      <TrashIcon
        v-if="hasFailed"
        @click="handleDelete"
        class="text-gray-300 h-6 w-6 cursor-pointer"
        :class="{ 'hover:text-red-500': !deleting }"
      />
    </div>
  </div>
</template>

<script>
import TrashIcon from "./icons/Trash.vue";
import AlertIcon from "./icons/Alert.vue";
import ExternalLinkIcon from "./icons/ExternalLink.vue";
import DownloadIcon from "./icons/Download.vue";
import Popper from "vue3-popper";

import axios from "axios";
import dayjs from "dayjs";

export default {
  components: {
    TrashIcon,
    ExternalLinkIcon,
    DownloadIcon,
    AlertIcon,
    Popper,
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
    hasFailed() {
      return Boolean(this.screencap.FailureReason);
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

<style scoped>
::v-deep .popper[data-popper-placement^="top"] > #arrow::before {
  margin-left: 3px;
  background-color: #a1a1aa;
}
</style>
