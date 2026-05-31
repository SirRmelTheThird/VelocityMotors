<template>
  <div class=" d-flex flex-column justify-content-center align-items-center not-found">
    <h1>404 – Page Not Found</h1>
    <p>Redirecting to homepage…</p>
  </div>
</template>

<script>
// Redirect Page
export default {
  mounted() {
    setTimeout(() => {
      this.$router.push('/');
    }, 3000);
  }
}
</script>