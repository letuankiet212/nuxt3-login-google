<script setup lang="ts">

const { login } = useGoogleLogin({
  onSuccess: () => {
    alert('onSuccess')
  },
  onError: () => {
    alert('onError')
  },
  onNonOAuthError: () => {
    alert('onNonOAuthError')
  }
})
</script>

<template>
  <div>
    <GoogleOAuthProvider client-id="1060234921755-sri8l7s2rmjtub266jo8easv7nkbmg12.apps.googleusercontent.com">
      <button @click="login"> Login by Google</button>
    </GoogleOAuthProvider>
  </div>

</template>
