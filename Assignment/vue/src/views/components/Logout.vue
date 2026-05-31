<template>
  <div v-if="loading" class="text-center">
      <div class="spinner-border text-dark"></div>
      <p class="mt-2">Logging out...</p>
    </div>
</template>

<script>

export default {
  // Data
  data() {
    return {
      loading: true
    };
  },

  // Logout
  created() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_id');
    window.dispatchEvent(new Event('logout'));

    setTimeout(() => {
      this.$router.push('/');
    }, 1500); 
  }
};

</script>