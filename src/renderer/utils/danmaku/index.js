import DmService from './danmaku'
import api from '../api'
import eve from '../events'

class dm {
  constructor (type, name) {
    this.name = name
    this.type = type
    this.status = false
    this.online = 0
    this.pkgCount = 0// 数据包计数
    this.roomid = 0
    this.dm = {}
    this.allow = true
    this._initConnect = false // 用于首次初始化的时候过滤HeartBeat的消息。
    eve.on('HeartBeat', () => {
      if (this._initConnect) {
        if (this.status) {
          this.CheckInType()
        } else {
          // status 变成断开，需要重新连接

          this.roomid = 0
          this.CheckInType()
        }
      }
    })
  }
  async CheckInType () {
    let flag = false
    let rq = await api.send('room/v3/area/getRoomList', {
      platform: 'web',
      parent_area_id: this.type,
      cate_id: 0,
      page: '1'
    }, 'get')

    // 检查前30热度的是否还有该主播
    flag = ~rq.data.list.map(v => v.roomid).indexOf(this.roomid)

    if (!flag) {
      eve.emit('info', this.name + '分区检测 ：检测到房间分区/房间热度变化，自动重新选择房间')
      this.disconnect()
      this.connect()
    } else {
      // eve.emit("info",this.name + "分区检测 ：房间分区正常");
      // 无须打印这么多正常房间消息
    }
  }
  async connect () {
    this.pkgCount = 0
    if (Object.keys(this.dm).length && this.dm._socket) {
      /* 防止多个socket并存 */
      this.disconnect()
    }

    let roomid = await this.getOnlineRoom()
    if (roomid !== 0) {
      this.roomid = roomid
      this.dm = new DmService({
        roomId: roomid
      })
      this.dm.on('connected', () => {
        this.status = true
        eve.emit('success', `${this.name}分区： 直播间 ${roomid} 连接成功`)
      })
      this.dm.connect()
      this.dm.on('data', data => {
        this.pkgCount++
        eve.emit('dm', {
          roomid: this.roomid,
          data
        })
        // console.log(data);
        switch (data.type) {
          case 'NOTICE_MSG':
            if (data.msg_self.indexOf('全区') < 0 && data.msg_self.indexOf('抽奖') >= 0) {
              // 单区广播礼物
              eve.emit('dm_liveLottery', data)
            }
            break
          case 'comment':
            break
          case 'SYS_MSG':
            /* 绘马没有roomid参数，小电视+摩天大楼等绿色通知 */
            if (data.roomid) {
              if (data.msg.indexOf('摩天大楼') >= 0) {
                // 仅提取摩天大楼
                if (this.allow) {
                  eve.emit('dm_SmallTv', data)
                }
              }
              // console.log(data);
            }
            break
          case 'SYS_GIFT':

            break
          case 'online':
            this.online = data.number
            if (data.type !== 'online' || data.number <= 10) {
              // number为0时即为下播
              this.disconnect()
              this.connect()
              // 当直播下线时自动切换到其他主播
              eve.emit('info', `${this.name}分区： 检测到下播，自动切换其他房间 ...`)
            }
            // console.log(data);
            break
          case 'gift':
            break
          case 'ROOM_SILENT_OFF':
            this.disconnect()
            this.connect()
            // 当直播下线时自动切换到其他主播
            eve.emit('info', `${this.name}分区： 检测到下播，自动切换其他房间 ...`)
            break
          default:
            break
        }
      })
    }

    this._initConnect = true // 设置initConnect的值，用于监听器判断当前是正在工作中状态
  }
  disconnect () {
    this.status = false
    if (typeof this.dm.disconnect === 'function') {
      this.dm.disconnect()
    }
    this.dm = {}
  }
  async getOnlineRoom (retry = 0) {
    let roomid
    try {
      let rq = await api.send('room/v3/area/getRoomList', {
        platform: 'web',
        parent_area_id: this.type,
        cate_id: 0,
        page: '1'
      }, 'get')
      let rooms = rq.data.list
      rooms = rooms.filter(v => {
        return v.roomid !== this.roomid
      })
      if (rooms.length === 0) {
        // fix 此处用于解决一个奇怪的undifined问题
        throw new Error('可用房间数量为 0 ')
      } else {
        rooms.sort((a, b) => { return b.online - a.online })
        roomid = rooms[ Math.floor((Math.random() / 2 * rooms.length)) ].roomid // 随机取一个房间
      }
      return roomid
    } catch (e) {
      eve.emit('info', `${this.name} :获取直播房间：${e.message}`)
      if (retry >= 5) {
        roomid = 0
      } else {
        eve.emit('info', `获取房间列表出错，第${retry + 1}次尝试`)
        roomid = await this.getOnlineRoom(retry + 1)
      }
      return roomid
    }
  }
}
export default dm
