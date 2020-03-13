<template>
  <div class="dialogPanel" v-if="isShowDialog" @click.stop.prevent>
    <div class="dialogContainer">

      <!-- alert -->
      <div class="alert flex flex-column" v-if="alertOptions.pr">
        <div class="title">{{alertOptions.title}}</div>
        <div class="message">{{alertOptions.message}}</div>
        <div class="buttonGroup flex flex-row-reverse">
          <div class="button" @click="resolveDialog(alertOptions)">确认</div>
        </div>
      </div>

      <!-- confirm -->
      <div class="alert flex flex-column" v-if="confirmOptions.pr">
        <div class="title">{{confirmOptions.title}}</div>
        <div class="message">{{confirmOptions.message}}</div>
        <div class="buttonGroup flex flex-row-reverse">
          <div class="button" @click="resolveDialog(confirmOptions)">确认</div>
          <div class="button" @click="rejectDialog(confirmOptions)">取消</div>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import Vue from 'vue'

function getPromise () {
  let resolveFunc = null
  let rejectFunc = null
  let promise = new Promise((resolve, reject) => {
    resolveFunc = resolve
    rejectFunc = reject
  })
  return {
    promise, resolve: resolveFunc, reject: rejectFunc
  }
}
export default {
  name: 'dialogPanel',
  data () {
    return {
      isShowDialog: false,
      alertOptions: {
        title: '',
        message: '',
        pr: null
      },
      confirmOptions: {
        title: '',
        message: '',
        pr: null
      }
    }
  },
  created () {
    Vue.prototype.alert = this.alert
    Vue.prototype.confirm = this.confirm
  },
  methods: {
    showDialog () {
      this.isShowDialog = true
      return getPromise()
    },
    rejectDialog (Options) {
      let {pr} = Options
      Options.pr = null
      pr && pr.reject && pr.reject()
      this.isShowDialog = false
    },
    resolveDialog (Options) {
      let {pr} = Options
      Options.pr = null
      pr && pr.resolve && pr.resolve(Options.value || '')
      this.isShowDialog = false
    },
    alert (message = '', title = '警告') {
      console.log('[alert]:', message, title)
      let pr = this.showDialog()
      this.alertOptions = {
        title,
        message,
        pr
      }
      return pr.promise
    },
    confirm (message = '', title = '警告') {
      console.log('[confirm]:', message, title)
      let pr = this.showDialog()
      this.confirmOptions = {
        title,
        message,
        pr
      }
      return pr.promise
    }
  }
}
</script>

<style lang="less">
.dialogPanel{
  position:fixed;
  display:flex;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.3);
  flex-direction: column;
  .dialogContainer{
    margin:60px auto 0 auto;
    flex:none;
    align-items: center;
    width:initial;
    height:auto;
    background-color:#252525;
    box-shadow: 0 0 25px 0 rgba(0,0,0,0.8);
    padding:20px;
    color:#ddd;
    border-radius:2px;
    .alert,.confirm{
      width:400px;
      .title{
        height:30px;
        line-height:30px;
        font-size:16px;
      }
      .message{
        min-height:30px;
        margin:10px 0;
        word-break: break-all;
      }
    }
    /* buttonGroup 通用样式 */
    .buttonGroup{
      height:30px;
      line-height:30px;
      .button{
        height:24px;
        line-height:24px;
        font-size:14px;
        padding:0 15px;
        margin:0 10px;
        background-color:#007acc;
        &:hover{
          background-color:#1f8ad2;
        }
      }
    }
  }
}
</style>