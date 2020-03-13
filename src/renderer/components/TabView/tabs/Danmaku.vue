<template>
  <div class="danmaku flex-column flex-auto">
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
    <div class="flowPanel flex-column flex-auto">
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
        <button class="btn-icon" @click="clearRecords" title="清空列表">
          <ficon icon="times"></ficon>
        </button>
        <!-- 导出数据 -->
        <button 
          class="btn-icon" 
          title="导出数据" 
          :disabled="recordOptions.records.length === 0"
          @click="exportToFile"
        >
          <ficon icon="upload"></ficon>
        </button>
        <!-- 导入数据 -->
        <button class="btn-icon" title="从文件导入" @click="importFromFile">
          <ficon icon="download"></ficon>
        </button>
        <div class="hline"></div>
        <ButtonSelector v-model="recordOptions.filterdArea" :options="areaOption" notEmpty></ButtonSelector>
        <div class="hline"></div>
        <ButtonSelector v-model="recordOptions.filterdType" :options="typeOption" single></ButtonSelector>
        <div class="hline"></div>
        <span class="info">
          {{filtedRecord.length}} / {{recordOptions.records.length}}
        </span>
        <span class="info" style="margin:0 10px;" v-if="recordOptions.records.length > 5000">（数据过多，可能导致卡顿）</span>
      </div>
      <div class="vline"></div>
      <!-- 数据区 -->
      <div class="flowDataContent flex-auto flex-row">
        <!-- 数据表格 -->
        <div class="tableContainer flex-none flex-column">
          <table class="listData flex-none">
            <thead>
              <td width="60px">分区</td>
              <td width="90px">房间</td>
              <td width="100px">时间</td>
              <td>类型</td>
            </thead>
          </table>
          <div class="scrollableMain scroll-y flex-auto">
            <table class="listData flex-auto">
              <template v-for="(item) of filtedRecord">
                <tr class="dmitem" :class="{selected:item.key === recordDeatilOption.key}" 
                :key="item.key" @click="expandDeatil(item)">
                  <td class="item" width="60px">
                    {{item.name}}
                  </td>
                  <td class="item" width="90px">
                    {{item.roomid}}
                  </td>
                  <td class="item" width="100px">
                    {{formatTime(new Date(item.time),"HH:mm:ss")}}
                  </td>
                  <td class="item">
                    {{item.data.type}}
                  </td>
                </tr>
              </template>
            </table>
          </div>
        </div>
        <!-- 数据解析 -->
        <div class="hline"></div>
        <div class="listDataDetail flex flex-auto scroll-y">
          <VueJsonPretty 
            v-if="recordDeatilOption.item"
            :data="recordDeatilOption.item" 
            :showLine="false" 
            @click="handleJsonClick"
            :showDoubleQuotes="false"
          ></VueJsonPretty>
          <div class="emptyBg flex-auto flex-center" v-else>
            <ficon icon="code"></ficon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import DanmakuService from '@/utils/danmaku'
import ButtonSelector from '@/views/ButtonSelector'
import VueJsonPretty from 'vue-json-pretty'
import {clipboard} from 'electron'
import {cacheAble, formatTime, writeJsonFile, readJsonFile} from '@/utils/tools'

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
        filterdArea: [],
        filterdType: []
      },
      recordDeatilOption: {
        key: '',
        item: null
      }
    }
  },
  components: {
    ButtonSelector,
    VueJsonPretty
  },
  computed: {
    typeOption () {
      return [
        {
          value: '',
          label: '所有类型'
        },
        {
          value: 'comment',
          label: '弹幕'
        },
        {
          value: 'gift',
          label: '礼物'
        },
        {
          value: 'online',
          label: '心跳'
        },
        {
          value: 'welcome',
          label: '欢迎'
        },
        {
          value: 'NOTICE_MSG',
          label: '活动信息'
        },
        {
          value: 'SYS_MSG',
          label: '系统消息'
        }
      ]
    },
    areaOption () {
      return this.square.map(item => {
        let {name, type} = item
        return {
          label: name,
          value: type
        }
      })
    },
    filtedRecord () {
      let {records, filterdArea, filterdType} = this.recordOptions
      return records.filter(v => {
        let type = v.type
        let dmType = v.data.type
        return this.checker({type, dmType}, filterdArea, filterdType)
      })
    }
  },
  mounted () {
    this.square.forEach(s => {
      s.dm = new DanmakuService(s.type, s.name)
      s.dm.connect()
    })
    this.$eve.on('dm', this.handleDmRecords)

    this.checker = cacheAble(this.checker) // 将校验函数转化为缓存函数，可以极大提升性能
  },
  beforeDestroy () {
    this.$eve.off('dm', this.handleDmRecords)
  },
  methods: {
    formatTime,
    async exportToFile () {
      writeJsonFile(this.recordOptions.records)
    },
    async importFromFile () {
      try {
        if (this.recordOptions.records.length) {
          await this.confirm('导入数据将清空已有数据')
        }
      } catch (e) {
        return // 拒绝
      }
      let data = await readJsonFile()
      // 简单检查数据格式
      if (data && Array.isArray(data) && data[0].data && data[0].key) {
        // 清空数据
        this.stopRecord()
        this.clearRecords()
        // 去重插入
        let KeyGenMap = {}
        this.recordOptions.records.forEach(i => {
          KeyGenMap[i.key] = 1
        })
        this.recordOptions.records.push(...data.filter(dmItem => !KeyGenMap[dmItem.key]))
      }
    },
    checker ({type, dmType}, filterdArea, filterdType) {
      let areaFlag = ~filterdArea.indexOf(type)
      let [targetType] = filterdType
      let typeFlag = targetType === '' ? true : targetType === dmType
      return areaFlag && typeFlag
    },
    // 弹幕数据处理函数
    handleJsonClick (path, value) {
      let text = path.replace(/^root\.?/, '')
      text && clipboard.writeText(text)
    },
    handleDmRecords (record) {
      if (this.recordOptions.record) {
        this.recordOptions.records.push(record)
      }
    },
    expandDeatil (item) {
      this.recordDeatilOption.key = item.key
      this.recordDeatilOption.item = item
    },
    stopRecord () {
      this.recordOptions.record = false
    },
    async startRecord () {
      try {
        if (this.recordOptions.records.length) {
          await this.confirm('重新开始录制将清空已有数据')
        }
      } catch (e) {
        return
        // canceled
      }
      this.clearRecords()
      this.recordOptions.record = true
    },
    clearRecords () {
      this.recordOptions.records = []
      this.recordDeatilOption = {
        key: '',
        item: null
      }
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
          &:disabled{
            opacity:0.5;
          }
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
        .tableContainer{
          width:600px;
          font-size:14px;
          table.listData{
            width:100%;
            td{
              padding:0 3px;
            }
            thead {
              box-shadow: 0 -4px 0 0 #1e1e1e inset,0 -5px 0 0 #666 inset ;
              td{
                padding:5px 3px 10px 3px;
                font-weight:bold;
              }
            }
          }
          .scrollableMain{
            
            .dmitem{
              padding:0px 3px;
              &.selected{
                background-color:#094771;
                color:#eee;
                &:hover{
                  background-color:#094771;
                }
              }
              &:hover{
                background-color:#303030;
                color:#eee;
              }
            }
          }
        }
        .listDataDetail{
          word-break: break-all;
          *{
            user-select: auto;
          }
          .code{
            font-family: consolas;
            font-size:14px;
          }
          .emptyBg{
            font-size:60px;
            color:#303030;
          }
        }
      }
    }
  }
</style>