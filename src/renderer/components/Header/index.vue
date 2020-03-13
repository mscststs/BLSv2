<template>
  <div class="header flex-row">
    <div class="flex-none header-icon flex-center flex">
      BLS
      <span class="version">( v {{packageOptions.version}} )</span>
    </div>
    <div class="flex-auto flex-center message">{{msg}}</div>
    <header-button icon="code-branch" @click="showAbout" tooltip="Git仓库"></header-button>
    <header-button icon="wrench" @click="openDevTool" tooltip="开发者工具"></header-button>
    <header-button icon="minus" @click="minimize" tooltip="最小化"></header-button>
    <header-button icon="times" type="danger" @click="close" tooltip="关闭"></header-button>
  </div>
</template>

<script>
import {ipcRenderer, shell} from 'electron'
import packageOptions from '@/../../package.json'

import HeaderButton from './HeaderButton'

export default {
  name: 'barheader',
  data () {
    return {
      packageOptions,
      msg: '',
      lastTimeoutId: 0
    }
  },
  components: {
    HeaderButton
  },
  mounted () {
    this.$eve.on('toast', this.handleToastMsg)
  },
  beforeDestroy () {
    this.$eve.off('toast', this.handleToastMsg)
  },
  methods: {
    handleToastMsg (msg, duration = 3000) {
      if (this.lastTimeoutId) {
        clearTimeout(this.lastTimeoutId)
      }
      this.msg = msg
      this.lastTimeoutId = setTimeout(() => {
        this.msg = ''
      }, duration)
    },
    showAbout () {
      // 显示程序授权信息
      shell.openExternal('https://github.com/mscststs/BLSv2')
    },
    openDevTool () {
      ipcRenderer.send('window', 'devTool')
    },
    minimize () {
      ipcRenderer.send('window', 'minimize')
    },
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
    .message{
      color:#fff;
      transition:all 0.25s;
    }
    .header-icon{
      padding-left:16px;
      color:#fff;
      .version{
        font-size: 12px;
        margin:0 5px;
      }
    }
    button{
      -webkit-app-region: no-drag;
    }
  }
</style>