<script setup>
  // ❌ No importes Login.vue directamente
  // import Login from './views/Login.vue'
</script>

<template>
  <!-- ✅ Este es el contenedor dinámico que carga Login, UserManager, etc -->
  <router-view />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

