import { inject, nextTick, ref } from "vue";
import { CodeClientConfig, CodeResponse, NonOAuthError } from "../types";

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

export type UseGoogleLoginOptionsAuthCodeFlow = {
  flow?: "auth-code";
} & AuthCodeFlowOptions;

export type UseGoogleLoginOptions = UseGoogleLoginOptionsAuthCodeFlow;

export default function useGoogleLogin({
  flow = "auth-code",
  scope = "",
  onSuccess,
  onError,
  onNonOAuthError,
  overrideScope,
  state,
  ...props
}: UseGoogleLoginOptions) {
  const $google = inject<{
    clientId?: string;
    isLoadedSuccessfully: boolean;
  }>("$google");

  const clientRef = ref<any>();
  const onSuccessRef = ref(onSuccess);
  const onErrorRef = ref(onError);
  const onNonOAuthErrorRef = ref(onNonOAuthError);

  const addClientId = () => {
    if (!$google.isLoadedSuccessfully) {
      throw new Error(
        "Google OAuth components must be used within GoogleOAuthProvider"
      );
    }

    if (!$google.clientId) {
      throw new Error("Google Client ID is not defined");
    }

    const clientMethod = "initCodeClient";

    const client = window?.google?.accounts.oauth2[clientMethod]({
      client_id: $google.clientId,
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
