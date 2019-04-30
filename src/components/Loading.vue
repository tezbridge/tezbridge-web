<template>
  <div class="bar">
    <span></span>
  </div>
</template>

<script>
// @flow

export default {
  data() {
    return {
      direction: true
    }
  }
}
</script>

<style scoped>
div.bar {display: flex; border-radius: 2px; width: 96px; height: 2px; overflow: hidden; }
span {display: inline-block; height: 2px; background: black; animation: loading 0.8s infinite}

@keyframes loading {
  0% {
    margin-left: 0px;
    width: 2px;
  }

  25% {
    width: 16px;
  }

  50% {
    margin-left: 88px;
    width: 2px;
  }

  75% {
    width: 16px;
  }

  100% {
    margin-left: 0px;
    width: 2px;
  }
}

</style>