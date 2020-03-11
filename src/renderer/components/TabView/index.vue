<template>
  <div class="tabView flex-auto flex-row">
    <!-- 左侧 tab 列表 -->
    <div class="tabTitle flex-column flex-none scroll-y">
      <template v-for="(tab,index) of tabs">
        <div class="tabItem flex-center" :class="{active:index === activeId}" :key="tab.tabName"
        @click="setActive(index)">
          {{tab.tabName}}
        </div>
      </template>
    </div>
    <!-- 右侧 tab 内容 -->
    <div class="tabContent flex-column flex-auto scroll-y">
      <template v-for="(tab,index) of tabs">
        <component :is="tab.component" :key="tab.tabName" v-show="index === activeId"></component>
      </template>
    </div>
  </div>
</template>

<script>
import tabs from './tabs'

export default {
  name: 'tabView',
  data () {
    return {
      tabs,
      activeId: 0
    }
  },
  methods: {
    setActive (index) {
      this.activeId = index
    }
  }
}
</script>

<style lang="less">
.tabView{
  .tabTitle{
    width:150px;
    background-color:#252526;
    .tabItem{
      width:100%;
      height:40px;
      color:#ccc;
      font-size:15px;
      letter-spacing: 1px;
      &.active{
        color:#fff;
        background-color:#37373d;
      }
    }
  }
  .tabContent{
    color:#ccc;
    padding:5px;
  }
}
</style>