import {shallowMount} from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import { useContacts } from "@/composables/contacts";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});

describe("useContacts", () => {
  const useContact = useContacts()

  it("Expect AppState changed by invoking a method", () => {
    useContact.appStateMethod.toIdle()
    expect(useContact.appState.value).toBe('idle')

    useContact.appStateMethod.toCreating()
    expect(useContact.appState.value).toBe('creating')

    useContact.appStateMethod.toEditing()
    expect(useContact.appState.value).toBe('editing')
  })

  it("Expect DataState changed by invoking a method", () => {
    useContact.dataStateMethod.toIdle()
    expect(useContact.dataState.value).toBe('idle')

    useContact.dataStateMethod.toModified()
    expect(useContact.dataState.value).toBe('modified')

    useContact.dataStateMethod.toSync()
    expect(useContact.dataState.value).toBe('synced')
  })
})