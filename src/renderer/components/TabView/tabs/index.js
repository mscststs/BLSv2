import ProgramSettings from './ProgramSettings'
import Users from './Users'
import Danmaku from './Danmaku'

export default [
  {
    tabName: '弹幕连接',
    component: Danmaku
  },
  {
    tabName: '用户管理',
    component: Users
  },
  {
    tabName: '功能设置',
    component: ProgramSettings
  }
]
