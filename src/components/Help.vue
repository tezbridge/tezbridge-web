<template>
  <div class="help-wrapper" @click.stop="showContent">
    <icon icon="question"></icon>
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
.help-wrapper {display: inline-block; font-size: 0.5rem; opacity: 0.1; }
.help-wrapper:hover {opacity: 0.5;}
/*.help-wrapper {position: relative; text-align: center; background: rgba(0,0,0,0.15);  display: inline-block; font-weight: 400; font-size: 0.6rem;  padding: 1px 4px; border-radius: 4px;}
.help-wrapper:hover {background: rgba(0,0,0,0.5)}
.icon {color: white; line-height: 0.6rem;}*/
</style>