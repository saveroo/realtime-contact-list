<template>
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div
      :class="
        `${
          dataStateMethod.isSync() ? '' : 'animate-ping'
        } -right-2 absolute bg-gradient-to-r bg-green-500 from-green-400 h-6 p-4 rounded-full shadow-md to-green-500 top-1 w-6`
      "
    ></div>
    <div class="px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10">
      <suspense>
        <template #default>
          <div>
            <form
              @submit.prevent="saveContact()"
              @input="deb()"
              class="items-center group-hover:bg-gray-600"
            >
              <CustomFields
                id="name"
                type="input"
                label="Name*"
                :error="formErrorMessage('name')"
                v-model="contactData.name"
                placeholder="e.g. Muhammad Surga Savero"
              >
              </CustomFields>
              <CustomFields
                id="email"
                type="input"
                label="Email*"
                :error="formErrorMessage('email')"
                v-model="contactData.email"
                placeholder="e.g. sav@example.com"
              >
              </CustomFields>
              <CustomFields
                type="input"
                label="Address*"
                :error="formErrorMessage('address')"
                v-model="contactData.address"
                id="address"
                placeholder="e.g. Apartment 47"
              >
              </CustomFields>
              <CustomFields
                id="job"
                type="select"
                label="Job*"
                :error="formErrorMessage('job')"
                v-model="contactData.job"
                :modelValue="contactData.job"
                @update:modelValue="contactData.job = $event"
                placeholder="-Select Job-"
                :options="jobList"
              >
              </CustomFields>
              <CustomFields
                id="note"
                type="textarea"
                label="Note"
                :error="formErrorMessage('note')"
                v-model="contactData.note"
                :modelValue="contactData.note"
                @update:modelValue="contactData.note = $event"
                placeholder="w"
              >
              </CustomFields>
              <div class="justify-between items-center grid grid-cols-2">
                <button
                  type="reset"
                  @click="cancelEditing()"
                  :class="styles.btnCancel.root()"
                >
                  Cancel
                </button>
                <button
                  @click="saveContact()"
                  :disabled="
                    contactData.meta?.completion !== 100 ||
                      !dataStateMethod.isSync()
                  "
                  :class="styles.btnSave.root()"
                >
                  <div
                    :style="styles.btnSave.divProgressBarStyle()"
                    :class="styles.btnSave.divProgressBarClass()"
                  ></div>
                  <span :class="styles.btnSave.spanAnimateOnFull()">
                    {{ styles.btnSave.textShowSaveOnFull() }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </template>
        <template #fallback>
          <div
            :class="
              `relative ${
                dataStateMethod.isSync() ? '' : 'animate-ping'
              } w-6 h-6 bg-green-500 rounded-full`
            "
          ></div>
        </template>
      </suspense>
    </div>
  </div>
</template>

<script lang="ts">
import { useContacts } from "@/composables/contacts";
import { debounce } from "lodash";
import { defineAsyncComponent, ref } from "vue";

const CustomFields = defineAsyncComponent({
  loader: () =>
    import("./CustomField.vue" /* webpackChunkName: "CustomField" */),
  delay: 200,
  suspensible: true
});
// TODO: refactor local setup() into composable if neccessary.
export default {
  name: "ContactNew",
  props: {
    formState: String,
    cData: Object
  },
  components: {
    // InputField,
    // SelectField,
    CustomFields
  },
  setup(props: any) {
    const {
      createContact,
      saveContact,
      cancelEditing,
      appStateMethod,
      appState,
      dataState,
      dataStateMethod,
      contactData,
      selectedContactId,
      contactDataErrors,
      formErrorMessage,
      ifCompletion,
      formCompletion,
      syncContactField
    } = useContacts();
    const jobList = ["Software Developer", "DevOps Engineer", "UI/UX Designer"];

    // TODO: create composable useStyles, or contrib/fork TailwindVue and port to vue 3
    const styles = {
      btnSave: {
        description: `Button is outlined, will show form completion, change its bg-color whenever reached completion, shadow on hover`,
        root: () =>
          "relative hover:shadow-md hover:bg-green-50 ml-2 mr-2 border text-white tracking-widest border-green-400 p-2 rounded-lg",
        divProgressBarStyle: () =>
          `width:${formCompletion() ?? 0}%; transition: width 1s;`,
        divProgressBarClass: () =>
          `absolute left-0 top-0 rounded-lg w-full h-full ${ifCompletion(
            "===",
            100,
            "bg-green-500",
            "bg-green-300"
          )} transition`,
        spanAnimateOnFull: () => `relative
        ${ifCompletion("<", 70, "text-black", "text-white")}
        ${ifCompletion("===", 100, "animate-pulse", "")}`,
        textShowSaveOnFull: () =>
          ifCompletion("<", 100, `${(formCompletion() / 100) * 5}/5`, "Save")
      },
      btnCancel: {
        root: () =>
          `hover:bg-green-50 mr-2 ml-2 border p-2 tracking-widest rounded-lg  ${ifCompletion(
            "===",
            100,
            "border-gray-500 ",
            "border-green-400"
          )}`
      }
    };

    const time = ref(0);
    const deb = debounce(() => {
      time.value += 1;
      syncContactField();
    }, 800);

    return {
      props,
      appState,
      appStateMethod,
      dataState,
      dataStateMethod,
      deb,
      contactData,
      contactDataErrors,
      cancelEditing,
      createContact,
      styles,
      saveContact,
      syncContactField,
      formErrorMessage,
      selectedContactId,
      jobList
    };
  }
};
</script>
<style></style>
