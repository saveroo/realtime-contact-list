<template>
  <div v-if="dataState === 'synced'">
    Form is synced with Firestore
  </div>
  <div v-else-if="dataState === 'modified'">
    Form data changed, will sync with Firebase
  </div>
  <div v-else-if="dataState === 'revoked'">
    Form data and Firebase revoked to original data
  </div>
  <div v-else-if="dataState === 'error'">
    Failed to save to Firestore. {{ errorMessage }}
  </div>
  <div v-else-if="dataState === 'idle'">Loading...</div>
</template>
<script lang="ts">
export default {
  name: "ServerState",
  props: ["dataState", "errorMessage"]
};
</script>
