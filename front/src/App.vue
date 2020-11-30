<template>
  <div>
    <contact-container>
      <h2
        :class="`${appTitleAnimateClass()} relative p-3 text-4xl text-gray-600 transform font-bold tracking-wider`"
      >
        <div class="relative">
          Contact List
        </div>
      </h2>
      <contact-new-button v-if="appStateMethod.isIdle()"></contact-new-button>
      <div v-if="error">:( {{ error }}</div>
      <Suspense v-else>
        <template #default>
          <contact-lists v-if="contacts.length > 0"></contact-lists>
        </template>
        <template #fallback>
          <div>"No Contact Lists"</div>
        </template>
      </Suspense>
      <contact-new-form
        :appState="appState"
        :c-data="contactData"
        v-if="['creating', 'editing'].includes(appState) && selectedContactId"
      ></contact-new-form>
    </contact-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, onErrorCaptured, onMounted } from "vue";
import ContactLists from "@/components/ContactLists.vue";
import ContactList from "@/components/ContactList.vue";
import ContactContainer from "@/components/ContactContainer.vue";
import ContactNewForm from "@/components/ContactEditForm.vue";
import ContactNewButton from "@/components/ContactNewButton.vue";
import { useContacts } from "@/composables/contacts";

export default defineComponent({
  name: "App",
  components: {
    ContactList,
    ContactLists,
    ContactContainer,
    ContactNewForm,
    ContactNewButton
  },
  setup() {
    const {
      appStateMethod,
      appState,
      contactData,
      contacts,
      error,
      load,
      selectedContactId
    } = useContacts();

    // Capture Error.
    onErrorCaptured(e => {
      error.value = e;
    });

    // Animate on Sync
    const appTitleAnimateClass = () =>
      ["creating", "editing"].includes(appState.value) &&
      appStateMethod.isCreating()
        ? "animate-bounce"
        : "";

    // On mounted Load Contact List from Firebase
    onMounted(() => load());

    return {
      appTitleAnimateClass,
      appState,
      appStateMethod,
      contacts,
      contactData,
      error,
      selectedContactId
    };
  }
});
</script>
