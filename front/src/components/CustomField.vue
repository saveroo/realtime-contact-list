<script lang="ts">
import { useContacts } from "@/composables/contacts";
import { computed, h, defineComponent, onMounted, onUpdated, ref } from "vue";
// TODO: Make a function to generate node from array of input objects for simple component.
// ?Perhaps could be improved and detached into separate libs

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface ICustomField {
  type: string;
  modelValue: string;
  label: string;
  id: string;
  placeholder: string;
  error: object;
  options: Array<string>;
}

export default defineComponent({
  name: "InputField",
  functional: true,
  props: {
    type: {
      type: String,
      required: true
    },
    modelValue: {
      required: true
    },
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false
    },
    error: {
      type: Object,
      required: false
    },
    options: {
      required: false,
      default: ["", ""]
    }
  },
  // ["type", "modelValue", "label", "id", "placeholder", "options"],
  setup(props: any, { emit }: { emit: any }) {
    const { formErrorMessage, contactData } = useContacts();
    // hacks...
    const errValidity = ref(props.error?.validity.value);
    const errMessage = ref(props.error?.message.value);

    const eValidity: any = computed({
      get: () => errValidity.value,
      set: val => (errValidity.value = val)
    });

    const eMessage: any = computed({
      get: () => errMessage.value,
      set: val => (errMessage.value = val)
    });

    const DivErrors = () =>
      h("div", { class: "relative text-red-600 text-sm font-thin mx-2" }, [
        h("span", [!eValidity.value ? eMessage.value : ""])
      ]);

    const Error = () => (!eValidity.value ? DivErrors() : "");

    const inputClass = () =>
      !eValidity.value ? "v-input-error" : "v-input-border";
    // console.log(props.error.validity, props.error.name, "PROPS");
    const DivWrapper = (props: ICustomField, ...children: any) =>
      h("div", { class: "p-2 w-full" }, [
        h("label", { for: props.id, class: "v-label-light" }, [props.label]),
        [...children, Error()]
      ]);
    const Select = (props: ICustomField) =>
      DivWrapper(
        props,
        h("span"),
        h(
          "select",
          {
            class: inputClass(),
            value: props.modelValue,
            onChange: ($event: any) => {
              emit("update:modelValue", $event.target.value);
            },
            id: props.id
          },
          props.options.map((k: string) => h("option", k))
        )
      );
    const Input = (props: ICustomField) =>
      DivWrapper(
        props,
        h("input", {
          id: props.label,
          value: props.modelValue,
          modelValue: props.modelValue,
          onInput: ($event: any) =>
            emit("update:modelValue", $event.target.value),
          class: inputClass(),
          placeholder: props.placeholder
        })
      );
    const TextArea = (props: ICustomField) =>
      DivWrapper(
        props,
        h(
          "textarea",
          {
            id: props.id,
            onInput: ($event: any) =>
              emit("update:modelValue", $event.target.value),
            class: inputClass()
          },
          [props.modelValue]
        )
      );
    onUpdated(() => {
      eValidity.value = props.error?.validity;
      eMessage.value = props.error?.message;
    });
    return () =>
      props.type === "textarea"
        ? TextArea(props)
        : props.type === "input"
        ? Input(props)
        : props.type === "select"
        ? Select(props)
        : props.type === undefined
        ? "No Type"
        : "Undefined";
  }
});
</script>
