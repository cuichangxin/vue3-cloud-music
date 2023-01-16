// import service from './service'
import api from './http'

export default{
  // 获取用户歌单
   playList:api('/api/user/playlist','post'),
   // 获取国家区号列表
   getCountries:api('/api/countries/code/list','get'),
   // 手机号密码登录
   phoneLogin:api('/api/login/cellphone','post'),
   // 发送验证码
   sentCode:api('/api/captcha/sent','post')
}