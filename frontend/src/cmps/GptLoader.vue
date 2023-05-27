<template>
  <div class="loader-wrapper">
    <span class="gpt-loader"></span>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
</style>
