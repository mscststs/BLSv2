<template>
  <div id="app">
    <Header></Header>
  </div>
</template>

<script>
import Header from './components/Header/index.vue'
export default {
  name: 'blsv2',
  components: {
    Header
  }
}
</script>

<style>
  /* CSS */
</style>

<style lang="less">
@import "assets/style/theme.less";

html, body {
  padding:0;
  margin:0;
  width:100%;
  height:100%;
  transition:all 0.25s;
  box-sizing:border-box;
  overflow: hidden;
  #app {
    width:100%;
    height:100%;
    display:flex;
    background-color:@bgColor;
    flex-direction: column;
  }
}
</style>