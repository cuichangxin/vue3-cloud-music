// import service from './service'
import api from './http'

export default {
  // 获取用户歌单
  playList: api('/user/playlist', 'post'),
  // 获取国家区号列表
  getCountries: api('/countries/code/list', 'get'),
  // 手机号密码登录
  phoneLogin: api('/login/cellphone', 'post'),
  // 发送验证码
  sentCode: api('/captcha/sent', 'post'),
  // 检测手机号是否注册
  checkPhone:api('/cellphone/existence/check','post'),
  // 获取用户详情
  userDetail:api('/user/detail','post'),
  // 获取首页信息
  homePage:api('/homepage/block/page','post')
}