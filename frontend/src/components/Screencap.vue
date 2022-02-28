<template>
  <a
    :href="screencap.Website"
    target="__blank"
    class="block rounded-md overflow-hidden shadow"
    :class="{ 'opacity-30': deleting }"
  >
    <img
      :src="`${bucketUrl}/${screencap.Path}`"
      class="w-full object-cover h-60 object-center"
    />
    <div class="p-4 flex justify-between">
      <div>
        <!-- <p>{{ screencap.Website }}</p> -->
        <p>{{ date }}</p>
      </div>

      <TrashIcon
        @click.prevent="handleDelete"
        class="text-gray-300"
        :class="{ 'hover:text-red-600': !deleting }"
      />
    </div>
  </a>
</template>

<script>
import TrashIcon from "./icons/Trash";

import axios from "axios";
import dayjs from "dayjs";

export default {
  components: {
    TrashIcon,
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
    bucketUrl() {
      return process.env.VUE_APP_SCREENCAP_URL;
    },
    date() {
      return dayjs(this.screencap.Date.split("#")[1]).fromNow();
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
