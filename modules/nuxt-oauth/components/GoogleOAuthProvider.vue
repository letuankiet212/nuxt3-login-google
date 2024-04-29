<script setup lang="ts">
interface UseLoadScriptOptions {
    /**
     * Nonce applied to GSI script tag. Propagates to GSI's inline style tag
     */
    nonce?: string
    /**
     * Callback fires on load [gsi](https://accounts.google.com/gsi/client) script success
     */
    onScriptLoadSuccess?: () => void
    /**
     * Callback fires on load [gsi](https://accounts.google.com/gsi/client) script failure
     */
    onScriptLoadError?: () => void
}

interface GoogleOAuthProviderProps extends /* @vue-ignore */ UseLoadScriptOptions {
    clientId: string;
}

const props = defineProps<GoogleOAuthProviderProps>();
const isLoadedSuccessfully = ref(false);
const google = useState('google', () => ({
    clientId: props.clientId,
    isLoadedSuccessfully
}));

onMounted(() => {
    if (document.getElementById('google-auth-script')) {
        isLoadedSuccessfully.value = true;
    };

    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://accounts.google.com/gsi/client';
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.id = 'google-auth-script';
    scriptTag.onload = () => {
        isLoadedSuccessfully.value = true;
        props.onScriptLoadSuccess?.();
    };
    scriptTag.onerror = () => {
        isLoadedSuccessfully.value = false;
        props.onScriptLoadError?.();
    };

    document.body.appendChild(scriptTag);

    google.value = {
        clientId: props.clientId,
        isLoadedSuccessfully
    };
});

</script>

<template>
    <ClientOnly>
        <slot />
        <template #fallback>
            <slot name='fallback' />
        </template>
    </ClientOnly>
</template>
