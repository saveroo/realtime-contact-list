import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/tailwind.css"
const vueInstance = createApp(App)

// TODO: Global Component works, however IDE intelisense couldn't detect
// const req = require.context(
//     "@/components",
//     true,
//     /.(vue|js)$/
// );
// req.keys().forEach(key => {
//     const componentName = key.replace(/^.\/(.*).(vue|js)/, "$1");
//     const component = req(key).default;
//     vueInstance.component(componentName, component);
// });

vueInstance.mount("#app");