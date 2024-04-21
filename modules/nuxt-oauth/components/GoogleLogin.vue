<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { GoogleCredentialResponse, GsiButtonConfiguration } from '../types';
import { CredentialResponse, IdConfiguration } from '../types';
import { extractClientId } from '../utils';

const containerHeightMap = { large: 40, medium: 32, small: 20 };

export type GoogleLoginProps = {
    onSuccess: (credentialResponse: CredentialResponse) => void;
    onError?: () => void;
    useOneTap?: boolean;
} & Omit<IdConfiguration, 'client_id' | 'callback'> &
    GsiButtonConfiguration;

const $google = inject<{
    clientId?: string;
    isLoadedSuccessfully: boolean;
}>("$google");

const {
    onSuccess,
    onError,
    type,
    theme,
    size,
    text,
    shape,
    logo_alignment,
    width,
    locale,
    click_listener,
    ...props
} = withDefaults(defineProps<GoogleLoginProps>(), {
    type: 'standard',
    theme: 'outline',
    size: 'large',
})

const btnContainerRef = ref<HTMLDivElement | null>(null)
const onErrorRef = ref(onError)
const onSuccessRef = ref(onSuccess)

onMounted(() => {
    debugger;
    if (!$google.isLoadedSuccessfully) return;

    window?.google?.accounts?.id?.initialize({
        client_id: $google.clientId,
        callback: (credentialResponse: GoogleCredentialResponse) => {
            if (!credentialResponse?.credential) {
                return onErrorRef.value?.();
            }

            const { credential, select_by } = credentialResponse;
            onSuccessRef.value({
                credential,
                clientId: extractClientId(credentialResponse),
                select_by,
            });
        },
        ...props,
    });

    window?.google?.accounts?.id?.renderButton(btnContainerRef.value, {
        type,
        theme,
        size,
        text,
        shape,
        logo_alignment,
        width,
        locale,
        click_listener,
    })
})
</script>

<template>
    <div ref="btnContainerRef">

    </div>
</template>

<style scoped></style>