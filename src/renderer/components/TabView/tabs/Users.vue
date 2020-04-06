<template>
  <div class="users flex-column flex-auto">
    <div class="flex-row flex-none cmdine">
      <button class="normal-btn" @click="AddUser">
        <ficon icon="plus"></ficon> 新增用户
      </button>
      
    </div>
    <div class="vline"></div>
  </div>
</template>

<script>
import {userLogin} from '@/utils/tools'
export default {
  name: 'Users',
  data () {
    return {

    }
  },
  methods: {
    async AddUser () {
      try {
        let [username, password] = await this.prompt('用户登录', [
          '用户名',
          '密码'
        ])
        let cookies = await userLogin(username, password)
        console.log(cookies)
      } catch (e) {
        console.log(e.message || e)
      }
    }

  }
}
</script>

<style lang="less">
  .users{
    padding:10px;
    .cmdine{
      height:30px;
      .normal-btn{
          color:#ccc;
          cursor:pointer;
          &:hover{
            text-decoration: underline;
          }
      }
    }
  }
</style>