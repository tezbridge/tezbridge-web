<template>
  <div>
    {{ x }}
    <b-button class="bg-primary text-secondary">{{ x }}</b-button>
  </div>
</template>

<script>
// @flow

export default {
  data() {
    return {
      x: 'test'
    }
  }  
}
</script>