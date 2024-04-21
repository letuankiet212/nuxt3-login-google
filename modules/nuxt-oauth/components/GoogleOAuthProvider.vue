<script setup lang="ts">
import useLoadScript, { type UseLoadScriptOptions } from './../composables/useLoadScript';

interface GoogleOAuthProviderProps extends /* @vue-ignore */ UseLoadScriptOptions {
    clientId: string;
}

const props = defineProps<GoogleOAuthProviderProps>();


const isLoadedSuccessfully = useLoadScript(
    {
        nonce: props.nonce,
        onScriptLoadSuccess: props.onScriptLoadSuccess,
        onScriptLoadError: props.onScriptLoadError,
    }
);

useNuxtApp().$google = {
    clientId: props.clientId,
    isLoadedSuccessfully
}
</script>

<template>
    <slot />
</template>
