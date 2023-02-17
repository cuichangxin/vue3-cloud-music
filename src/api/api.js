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
  // 主页banner
  homeBanner:api('/banner','post'),
  // 新建歌单
  createPlaylist:api('/playlist/create','get'),
  // 删除歌单
  removePlaylist:api('/playlist/delete','get'),
  // 推荐歌单(未登录)
  personalized:api('/personalized','get'),
  // 独家放送
  privatecontent:api('/personalized/privatecontent/list','post'),
  // 主页最新音乐
  homeNewMusic:api('/personalized/newsong','get'),
  // 新歌速递
  newSongSpeed:api('/top/song','get'),
  // 二维码获取key
  qrCodeKey:api('/login/qr/key','get'),
  // 二维码图片
  qrCodePic:api('/login/qr/create','get'),
  // 二维码登录状态检测
  qrCodeDete:api('/login/qr/check','get'),
  // 获取用户信息
  userData:api('/user/account','post'),
  // 获取歌曲详情
  songDetail:api('/song/detail','get'),
  // 获取音乐url
  songUrl:api('/song/url','get'),
  // 获取用户播放记录
  playRecord:api('/user/record','get')
}