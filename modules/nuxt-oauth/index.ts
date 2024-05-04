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

    // Register Plugin
    addPlugin(resolve(__dirname, './plugin.ts'))

    // Register Components
    addComponent({
      name: 'GoogleOAuthProvider',
      filePath: resolver.resolve('./components/GoogleOAuthProvider.vue')
    })

    // Register Composables
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(__dirname, './composables'))
    })
  }
})
