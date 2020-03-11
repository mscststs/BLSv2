<template>
  <div class="danmaku flex-column">
    <!-- 分区广播 -->
    <div class="areaList flex-none flex-column">
      <template v-for="(item) of square">
        <div class="connectionItem flex-none" :key="item.name">
          {{item.dm}}
        </div>
      </template>
    </div>
    Danmaku
  </div>
</template>

<script>

import DanmakuService from '@/utils/danmaku'
export default {
  name: 'Danmaku',
  data () {
    return {
      square: [
        {
          name: '娱乐',
          type: 1,
          dm: null
        },
        {
          name: '网游',
          type: 2,
          dm: null
        },
        {
          name: '手游',
          type: 3,
          dm: null
        },
        {
          name: '绘画',
          type: 4,
          dm: null
        },
        {
          name: '电台',
          type: 5,
          dm: null
        },
        {
          name: '单机',
          type: 6,
          dm: null
        }
      ]
    }
  },
  mounted () {
    this.square.forEach(s => {
      s.dm = new DanmakuService(s.type, s.name)
      s.dm.connect()
    })
  },
  methods: {
  }
}
</script>

<style lang="less">
  
</style>