<template>
  <div
    class="overflow-y-auto h-56 px-4 py-10 bg-white shadow-lg sm:rounded-3xl max-w-md sm:w-2/3"
  >
    <ul class="w-full h-full">
      <li
        v-for="(i, k) in props.lists"
        :key="k"
        class="p-4 mb-3 flex justify-between items-center bg-white shadow rounded-lg"
      >
        <div class="pr-7">
          <div class="text-gray-700 sm:text-sm font-semibold">
            {{ i.name }}
          </div>
          <div class="text-gray-600 sm:text-sm font-thin">
            {{ i.job }}
          </div>
        </div>
        <div class="flex">
          <div
            @click="editContact(i._key)"
            class="hover:bg-opacity-100 bg-opacity-60 text-red-900 rounded bg-green-500 p-1 mx-1 border border-green-500"
          >
            <svg
              focusable="false"
              class="text-white h-5 w-5 m-1 cursor-pointer"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path
                fill="currentColor"
                d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h274.9c-2.4-6.8-3.4-14-2.6-21.3l6.8-60.9 1.2-11.1 7.9-7.9 77.3-77.3c-24.5-27.7-60-45.5-99.9-45.5zm45.3 145.3l-6.8 61c-1.1 10.2 7.5 18.8 17.6 17.6l60.9-6.8 137.9-137.9-71.7-71.7-137.9 137.8zM633 268.9L595.1 231c-9.3-9.3-24.5-9.3-33.8 0l-37.8 37.8-4.1 4.1 71.8 71.7 41.8-41.8c9.3-9.4 9.3-24.5 0-33.9z"
              ></path>
            </svg>
          </div>
          <div
            @click="deleteContact(i._key)"
            class="hover:bg-opacity-100 bg-opacity-60 text-red-900 rounded bg-red-500 p-1 mx-1 border border-red-500"
          >
            <svg
              focusable="false"
              class="text-red-100 h-5 w-5 m-1 cursor-pointer"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
              ></path>
            </svg>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useContacts } from "@/composables/contacts";

export default defineComponent({
  name: "ContactList",
  props: {
    lists: Array
  },
  setup(props) {
    const { editContact, contacts, deleteContact } = useContacts();
    return {
      props,
      contacts,
      editContact,
      deleteContact
    };
  }
});
</script>
