declare module '#app' {
  interface NuxtApp {
    $google: Ref<{
      clientId?: string
      isLoadedSuccessfully: Ref<boolean>
    }>
  }
}

declare module 'nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $google: Ref<{
      clientId?: string
      isLoadedSuccessfully: Ref<boolean>
    }>
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      google: useState<{
        clientId?: string
        isLoadedSuccessfully: Ref<boolean>
      }>('google')
    }
  }
})
