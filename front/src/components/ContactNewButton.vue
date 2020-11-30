<template>
  <div class="m-5 relative justify-center items-center flex">
    <transition>
      <button
        v-if="appStateMethod.isIdle"
        @click="createBlankContactDocument()"
        class="hover:bg-green-500 border border-green-400 w-full p-3 rounded-lg"
      >
        Create New Contact
      </button>
    </transition>
  </div>
  <!--  <div class="-mx-3 md:flex mt-2">-->
  <!--    <div class="md:w-full px-3">-->
  <!--      <button-->
  <!--        @click="createBlankContactDocument()"-->
  <!--        class="md:w-full bg-green-600 text-white font-bold py-2 px-4 border-b-3 hover:border-b-2 border-gray-500 hover:border-gray-100 hover:bg-green-500 rounded"-->
  <!--      >-->
  <!--        New Contact-->
  <!--      </button>-->
  <!--    </div>-->
  <!--  </div>-->
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useContacts } from "@/composables/contacts";

export default defineComponent({
  name: "ContactNewButton",
  setup() {
    const { appStateMethod, createBlankContactDocument } = useContacts();
    return {
      appStateMethod,
      createBlankContactDocument
    };
  }
});
</script>
