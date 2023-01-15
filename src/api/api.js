// import service from './service'
import api from './http'

export default{
  // 获取用户歌单
   playList:api('/api/user/playlist','post'),
   // 获取国家区号列表
   getCountries:api('/api/countries/code/list','get')
}