declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'lodash' {
  import {debounce, once} from '@types/lodash'
  export {
    debounce,
    once
  }
}
