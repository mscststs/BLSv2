<template>
  <div class="header flex-row">
    <div class="flex-auto"></div>
    <header-button icon="terminal" @click="openDevTool"></header-button>
    <header-button icon="minus" @click="minimize"></header-button>
    <header-button icon="times" type="danger" @click="close"></header-button>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'

import HeaderButton from './HeaderButton'

export default {
  name: 'barheader',
  components: {
    HeaderButton
  },
  methods: {
    openDevTool () {
      ipcRenderer.send('window', 'devTool')
    },
    /**
     * 最小化
     */
    minimize () {
      ipcRenderer.send('window', 'minimize')
    },
    /**
       * 关闭窗口
       */
    async close () {
      try {
        await this.confirm('程序将完全退出')
        ipcRenderer.send('window', 'close')
      } catch (e) {

      }
    }
  }
}
</script>

<style lang="less">
  .header{
    display:flex;
    flex:none;
    height:35px;
    -webkit-app-region: drag;
    background-color:#323233;
    button{
      -webkit-app-region: no-drag;
    }
  }
</style>