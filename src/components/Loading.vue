<template>
  <div class="loading-block">
    <span></span>
  </div>
</template>

<script>
// @flow

export default {
  data() {
    return {
    }
  }
}
</script>

<style scoped>
div.loading-block {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top: 2px solid black;
  border-radius: 8px;
  animation: loading 2.4s infinite;
}

@keyframes loading {
  0% {
    transform: rotate(180deg);
  }

  50% {
    transform: rotate(1080deg);
  }

  100% {
    transform: rotate(180deg);
  }
}

</style>