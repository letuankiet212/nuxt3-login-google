import { nextTick, ref } from "vue";
import type { CodeClientConfig, CodeResponse, NonOAuthError } from "../types/index";

interface AuthCodeFlowOptions
  extends Omit<
    CodeClientConfig,
    "client_id" | "scope" | "callback" | "error_callback"
  > {
  onSuccess?: (
    codeResponse: Omit<
      CodeResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => void;
  onError?: (
    errorResponse: Pick<
      CodeResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => void;
  onNonOAuthError?: (nonOAuthError: NonOAuthError) => void;
  scope?: CodeResponse["scope"];
  overrideScope?: boolean;
}

export type UseGoogleLoginOptionsAuthCodeFlow = AuthCodeFlowOptions;

export type UseGoogleLoginOptions = UseGoogleLoginOptionsAuthCodeFlow;

export default function useGoogleLogin({
  scope = "",
  onSuccess,
  onError,
  onNonOAuthError,
  overrideScope,
  state,
  ...props
}: UseGoogleLoginOptions) {
  const { $google } = useNuxtApp();

  const clientRef = ref<any>();
  const onSuccessRef = ref(onSuccess);
  const onErrorRef = ref(onError);
  const onNonOAuthErrorRef = ref(onNonOAuthError);

  const addClientId = () => {
    if (!$google.value.isLoadedSuccessfully) {
      throw new Error(
        "Google OAuth components must be used within GoogleOAuthProvider"
      );
    }

    if (!$google.value.clientId) {
      throw new Error("Google Client ID is not defined");
    }

    const clientMethod = "initCodeClient";

    const client = window?.google?.accounts.oauth2[clientMethod]({
      client_id: $google.value.clientId,
      scope: overrideScope ? scope : `openid profile email ${scope}`,
      callback: (response) => {
        if (response.error) {
          onErrorRef.value?.(response);
          return;
        }

        onSuccessRef.value?.(response);
      },
      error_callback: (nonOAuthError) => {
        onNonOAuthErrorRef.value?.(nonOAuthError);
      },
      state,
      ...props,
    });

    clientRef.value = client;
  };

  const login = async () => {
    addClientId();
    await nextTick();

    clientRef.value?.requestCode();
  };

  return {
    login,
  };
}
