<template>
  <div id="app">
    <Header></Header>
    <div class="content flex-auto">
      
      <!-- 全局弹框 -->
      <Dialog></Dialog>
    </div>
  </div>
</template>

<script>
import Header from './components/Header/'
import Dialog from './components/dialog/'
export default {
  name: 'blsv2',
  components: {
    Header,
    Dialog
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