<template>
  <div class="danmaku flex-column">
    <!-- 分区广播 -->
    <table class="areaList flex-none">
      <thead>
        <td>分区</td>
        <td>房间</td>
        <td>人气值</td>
        <td>状态</td>
        <td>数据包</td>
      </thead>
      <template v-for="(item) of square">
        <tr class="connectionItem" :key="item.name" v-if="item.dm">
          <td class="item">
            {{item.dm.name}}
          </td>
          <td class="item">
            {{item.dm.roomid}}
          </td>
          <td class="item">
            {{item.dm.online}}
          </td>
          <td class="item">
            {{item.dm.status ? "已连接" : "未连接"}}
          </td>
          <td class="item">
            {{item.dm.pkgCount}}
          </td>
        </tr>
      </template>
    </table>
    <div class="vline"></div>
    <!-- 弹幕数据监控面板 -->
    <div class="flowPanel flex-column">
      <!-- 控制条 -->
      <div class="control flex-row flex-none">

      </div>
      <!-- 数据区 -->
      <div class="flowDataContent flex-auto flex-column">
        
      </div>
    </div>
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
  .danmaku{
    padding:10px;
    .areaList{
      width:100%;
      td{
        padding:0 3px;
      }
      thead {
        box-shadow: 0 -4px 0 0 #1e1e1e inset,0 -5px 0 0 #666 inset ;
        td{
          padding:5px 3px 10px 3px;
          font-weight:bold;
          font-size:14px;
        }
      }
      .connectionItem{
        transition:all 0.1s;
        font-size:14px;
        line-height: 20px;
        height:20px;
        &:hover{
          background-color:#424242;
          color:#fff;
        }
      }
    }
  }
</style>