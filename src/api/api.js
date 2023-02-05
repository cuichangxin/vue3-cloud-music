// import service from './service'
import api from './http'

export default {
  // 获取用户歌单
  playList: api('/user/playlist', 'get'),
  // 获取国家区号列表
  getCountries: api('/countries/code/list', 'get'),
  // 手机号密码登录
  phoneLogin: api('/login/cellphone', 'post'),
  // 发送验证码
  sentCode: api('/captcha/sent', 'post'),
  // 检测手机号是否注册
  checkPhone:api('/cellphone/existence/check','post'),
  // 获取用户详情
  userDetail:api('/user/detail','get'),
  // 获取首页信息
  homePage:api('/homepage/block/page','post'),
  // 新建歌单
  createPlaylist:api('/playlist/create','get'),
  // 删除歌单
  removePlaylist:api('/playlist/delete','get'),
  // 推荐歌单(未登录)
  personalized:api('/personalized','get'),
  // 独家放送
  privatecontent:api('/personalized/privatecontent/list','post')
}