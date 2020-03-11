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
        <!-- 录制 -->
        <template>
          <button class="btn-icon red" v-if="recordOptions.record" @click="stopRecord" title="关闭数据分析器">
            <ficon icon="circle"></ficon>
          </button>
          <button class="btn-icon" v-else @click="startRecord" title="打开数据分析器">
            <ficon icon="stop"></ficon>
          </button>
        </template>
        <!-- 清空 -->
        <button class="btn-icon" @click="clearRecords" title="清空">
          <ficon icon="times"></ficon>
        </button>
        <div class="hline"></div>
        <ButtonSelector v-model="recordOptions.filterdArea" :options="areaOption"></ButtonSelector>
        <div class="hline"></div>
      </div>
      <!-- 数据区 -->
      <div class="flowDataContent scroll-y flex-auto flex-column">
        <!-- <template v-for="(item,index) of recordOptions.records">
          <div class="recordItem flex-none" :key="index">
            {{item}}
          </div>
        </template> -->
      </div>
    </div>
  </div>
</template>

<script>

import DanmakuService from '@/utils/danmaku'
import ButtonSelector from '@/views/ButtonSelector'
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
      ],
      recordOptions: {
        record: false,
        records: [],
        filterdArea: ['娱乐']
      }
    }
  },
  components: {
    ButtonSelector
  },
  computed: {
    areaOption () {
      return this.square.map(item => {
        let {name} = item
        return {
          label: name,
          value: name
        }
      })
    }
  },
  mounted () {
    this.square.forEach(s => {
      s.dm = new DanmakuService(s.type, s.name)
      s.dm.connect()
    })
    this.$eve.on('dm', this.handleDmRecords)
  },
  beforeDestroy () {
    this.$eve.off('dm', this.handleDmRecords)
  },
  methods: {
    // 弹幕数据处理函数
    handleDmRecords (record) {
      if (this.recordOptions.record) {
        console.log(record)
        this.recordOptions.records.push(record)
      }
    },
    stopRecord () {
      this.recordOptions.record = false
    },
    startRecord () {
      this.recordOptions.record = true
      this.recordOptions.records = []
    },
    clearRecords () {
      this.recordOptions.records = []
    }
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
          background-color:#303030;
          color:#fff;
        }
      }
    }
    .flowPanel{
      .control{
        min-height:20px;
        height:20px;
        line-height:20px;
        font-size:12px;
        .btn-icon{
          height:20px;
          width:20px;
          display:flex;
          justify-content: center;
          align-items: center;
          color:#999;
          margin:0 2px;
          &.red{
            color:#d04c39;
            &:hover{
              color:#f48771
            }
          }
          &:hover{
            color:#ccc;
          }
        }
      }
      .flowDataContent{
        width:100%;
      }
    }
  }
</style>