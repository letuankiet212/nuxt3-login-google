import {
  addImports,
  defineNuxtModule,
  addPlugin,
  addComponent,
  createResolver
} from '@nuxt/kit'
import { resolve } from 'pathe'

export default defineNuxtModule({
  meta: {
    // Usually the npm package name of your module
    name: 'nuxt-oauth',
    // Compatibility constraints
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '^3.0.0'
    }
  },
  // Default configuration options for your module, can also be a function returning those
  defaults: {},
  // Shorthand sugar to register Nuxt hooks
  hooks: {},
  // The function holding your module logic, it can be asynchronous
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add Plugin
    addPlugin(resolve(__dirname, './plugin.ts'))

    // Add Component
    addComponent({
      name: 'GoogleOAuthProvider',
      filePath: resolver.resolve('./components/GoogleOAuthProvider.vue')
    })

    addImports({
      name: 'useLoadScript', // name of the composable to be used
      from: resolver.resolve('./composables/useLoadScript') // path of composable
    })
  }
})
