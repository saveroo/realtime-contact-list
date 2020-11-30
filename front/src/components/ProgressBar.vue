<template>
  <!-- REPLACED with Button Progress Bar, not used atm. -->
  <div>
    <div class="relative mx-3 max-w-full h-7 bg-gray-400 rounded-r-xl">
      <div
        style="right:45%"
        class="absolute text-md text-black font-bold rounded"
      >
        {{ contactData.meta?.completion ?? 0 }}%
      </div>
      <div
        :style="
          `width:${contactData.meta?.completion ?? 0}%; transition: width 2s;`
        "
        class="rounded-r-xl transition w-1/2 h-7 bg-gradient-to-r from-green-500 to-green-600"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProgressBar",
  props: {
    width: Number
  },
  setup(props) {
    return {
      props
    };
  }
});
</script>
