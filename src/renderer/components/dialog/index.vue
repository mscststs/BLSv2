<template>
  <div class="dialogPanel" v-if="isShowDialog" @click.stop.prevent>
    <div class="dialogContainer">

      <!-- alert -->
      <div class="alert flex flex-column" v-if="alertOptions.pr">
        <div class="title">{{alertOptions.title}}</div>
        <div class="message">{{alertOptions.message}}</div>
        <div class="buttonGroup flex flex-row-reverse">
          <button class="button" @click="resolveDialog(alertOptions)">确认</button>
        </div>
      </div>

      <!-- confirm -->
      <div class="alert flex flex-column" v-if="confirmOptions.pr">
        <div class="title">{{confirmOptions.title}}</div>
        <div class="message">{{confirmOptions.message}}</div>
        <div class="buttonGroup flex flex-row-reverse">
          <button class="button" @click="resolveDialog(confirmOptions)">确认</button>
          <button class="button" @click="rejectDialog(confirmOptions)">取消</button>
        </div>
      </div>

      <!-- prompt -->
      <div class="alert flex flex-column" v-if="promptOptions.pr">
        <div class="title">{{promptOptions.title}}</div>
        <div class="form flex-column">
          <template v-for="(label,index) of promptOptions.form" >
            <div :key="index" class="form-item flex-none flex-row">
              <div class="label flex-none">
                {{label}}
              </div>
              <input
                v-focus="index===0"
                type="text"
                class="flex-auto form-input"
                v-model="promptOptions.value[index]"
              />
            </div>
          </template>
        </div>
        <div class="buttonGroup flex flex-row-reverse">
          <button class="button" @click="resolveDialog(promptOptions)">确认</button>
          <button class="button" @click="rejectDialog(promptOptions)">取消</button>
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
      },
      promptOptions: {
        title: '',
        form: null,
        value: null,
        pr: null
      }
    }
  },
  created () {
    Vue.prototype.alert = this.alert
    Vue.prototype.confirm = this.confirm
    Vue.prototype.prompt = this.prompt
  },
  watch: {
    'promptOptions.form': function (newVal) {
      this.promptOptions.value = Object.keys(newVal).map(() => '')
    }
  },
  methods: {
    showDialog () {
      this.isShowDialog = true
      return getPromise()
    },
    rejectDialog (Options) {
      let {pr} = Options
      Options.pr = null
      pr && pr.reject && pr.reject(new Error('[confirm/prompt]: 取消'))
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
    },
    prompt (title, form = {}) {
      console.log('[prompt]:', title, form)
      let pr = this.showDialog()
      this.promptOptions = {
        title,
        form,
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
      .form{
        padding:10px 0;
        .form-item{
          padding: 5px 0;
          .label{
            width:100px;
          }
          .form-input{
            background-color:#444;
            border:none;
            outline:none;
            color:#ccc;
            padding:3px 5px;
          }
        }
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
        &:focus{
          background-color:#1f8ad2;
        }
        &:hover{
          background-color:#1f8ad2;
        }
      }
    }
  }
}
</style>