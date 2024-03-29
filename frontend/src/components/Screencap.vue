<template>
  <div
    class="block rounded-md overflow-hidden shadow group"
    :class="{ 'opacity-30': deleting }"
  >
    <template v-if="screencap.status === 'COMPLETED'">
      <div class="w-full h-60 relative overflow-hidden">
        <img
          :src="screencap.url"
          loading="lazy"
          class="w-full object-cover h-full object-top"
        />

        <a
          :href="`http://${screencap.website}`"
          target="__blank"
          class="absolute flex items-center bottom-0 sm:-bottom-[32px] left-0 sm:opacity-0 group-hover:opacity-100 group-hover:bottom-0 bg-primary text-white text-sm transition-all duration-200 ease-out py-1 px-3 rounded-t-lg ml-3"
        >
          {{ screencap.website }}
          <ExternalLinkIcon class="h-3 w-3 ml-2" />
        </a>
      </div>

      <div class="p-4 flex items-center justify-between bg-white">
        <p class="text-sm">{{ date }}</p>

        <div class="flex items-center space-x-3">
          <a :href="screencap.url" download>
            <DownloadIcon class="h-6 w-6 text-gray-300 hover:text-primary" />
          </a>

          <StarIcon
            @click="toggleBookmark"
            :filled="bookmarked"
            class="h-6 w-6 cursor-pointer"
            :class="[
              bookmarked
                ? 'text-yellow-400'
                : 'text-gray-300 hover:text-yellow-400',
            ]"
          />

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
        <p class="text-sm truncate">{{ screencap.website }}</p>
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
import StarIcon from "./icons/Star.vue";
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
    StarIcon,
    Popper,
  },
  emits: ["deleted", "toggled-bookmark"],
  props: {
    screencap: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      bookmarked: this.screencap.bookmarked,
      deleting: false,
      togglingBookmark: false,
    };
  },
  computed: {
    date() {
      return dayjs(this.screencap.date).fromNow();
    },
    hasFailed() {
      return Boolean(this.screencap.failureReason);
    },
  },
  methods: {
    async handleDelete() {
      if (this.deleting) {
        return;
      }

      try {
        this.deleting = true;

        await axios.delete(`/screencaps/${this.screencap.id}`);

        this.$emit("deleted");
      } finally {
        this.deleting = false;
      }
    },
    async toggleBookmark() {
      if (this.togglingBookmark) {
        return;
      }

      try {
        this.togglingBookmark = true;

        this.bookmarked = !this.bookmarked;

        await axios({
          method: this.bookmarked ? "POST" : "DELETE",
          url: `/screencaps/${this.screencap.id}/bookmark`,
        });

        this.$emit("toggled-bookmark", this.bookmarked);
      } catch (error) {
        this.bookmarked = !this.bookmarked;
      } finally {
        this.togglingBookmark = false;
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
