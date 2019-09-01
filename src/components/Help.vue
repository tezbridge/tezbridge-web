<template>
  <div class="help-wrapper" @click.stop="showContent">
    <div class="icon">?</div>
  </div>
</template>

<script>
// @flow

export default {
  props: ['content'],
  data() {
    return {
    }
  },
  methods: {
    showContent() {
      window.alert(this.content.replace(/\s+/g, ' ').replace(/\|/g, '\n'))
    }
  }
}
</script>

<style scoped>
.help-wrapper {position: relative; text-align: center; background: rgba(0,0,0,0.15);  display: inline-block; font-weight: 400; font-size: 0.6rem;  padding: 1px 4px; border-radius: 4px;}
.help-wrapper:hover {background: rgba(0,0,0,0.5)}
.icon {color: white; line-height: 0.6rem;}
</style>