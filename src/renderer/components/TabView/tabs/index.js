import ProgramSettings from './ProgramSettings'
import Users from './Users'
import Danmaku from './Danmaku'

export default [
  {
    icon: 'link',
    tabName: '弹幕连接',
    component: Danmaku
  },
  {
    icon: 'user',
    tabName: '用户管理',
    component: Users
  },
  {
    icon: 'cog',
    tabName: '功能设置',
    component: ProgramSettings
  }
]
