<template>
  <div v-if="error">{{ error }}</div>
  <AsyncContact :lists="contactList.value"></AsyncContact>
</template>

<script>
import { defineAsyncComponent, computed, ref } from "vue";
import { useContacts } from "../composables/contacts";

const AsyncContact = defineAsyncComponent({
  loader: () =>
    import("./ContactList.vue" /* webpackChunkName: "cl" */),
  loadingComponent: () => import("./ServerState"), // not used atm.
  delay: 200,
  suspensible: true
});

export default {
  name: "ContactLists",
  async setup() {
    const { error, selectedContactId, contacts, load } = useContacts();
    const contactList = ref([]);
    contactList.value = computed(() => {
      return contacts.value;
    });
    return {
      contacts,
      contactList,
      error,
      selectedContactId,
    };
  },
  components: {
    AsyncContact
  }
};
</script>
