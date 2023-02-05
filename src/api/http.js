import Axios from "axios";
import { ElMessage } from 'element-plus';


// 请求记录栈
const requestStack = []
let cid = 0
function showLoading() {
  document.getElementById('el-loading-spin').style.display = 'block'
}
function hideLoading() {
  document.getElementById('el-loading-spin').style.display = 'none'
}
/**
 * 请求记录入栈
*/
function pushTarget() {
  if (!requestStack.length) {
    showLoading()
  }
  requestStack.push(cid++)
}
/**
 * 请求记录出栈
*/
function popTarget() {
  if (requestStack.length) {
    requestStack.pop()
  }
  // 所有请求处理完毕清空
  if (!requestStack.length) {
    hideLoading()
  }
}
// 全局默认配置
Axios.defaults.baseURL = '/api'
// 超时时间
Axios.defaults.timeout = 10000
// 允许携带cookie
Axios.defaults.withCredentials = true;
Axios.defaults.headers.post['Content-Type'] = 'application/json';

// 通用请求拦截器
Axios.interceptors.request.use(config => {
  // pushTarget()
  if (config.method == 'post') {
    config.data = {
      ...config.data,
      timestamp:Date.parse(new Date())
    }
  }else if (config.method == 'get') {
    config.params = {
      ...config.params,
      timestamp:Date.parse(new Date())
    }
  }
  return config
},
  err => {
    // console.error(err)
    return Promise.reject(err)
  }
)
// 通用响应拦截器
Axios.interceptors.response.use(response => {
  // popTarget()
  // if (response.status !== 200) {
  //   return Promise.reject(response.data)
  // }
  return response.data
},
  err => {
    // popTarget()
    // console.error(err)
    if (err && err.response && err.response.status) {
      if (err.response.data) {
        ElMessage({ message: err.response.data.message, type: 'error' })
      } else {
        switch (err.response.status) {
          case 404:
            ElMessage({ message: '请求不存在', type: 'error' })
            break;
          case 500:
            ElMessage({ message: '服务器繁忙', type: 'error' })
            break;
          case 502:
            ElMessage({ message: '服务器繁忙', type: 'error' })
            break;
          default:
            break;
        }
      }
    }
    return Promise.reject(err)
  }
)
/**
 * 返回axios promise对象
 * @param url
 * @param method
 * @returns {Promise<AxiosResponse<T>>}
*/

function api(url, method = 'post') {
  return function (params) {
    try {
      switch (method) {
        case 'post':
          return Axios.post(url, params)
        case 'get':
          return Axios.get(url, { params })
        default:
          throw new Error('请选择post或者get请求方法')
      }
    } catch (error) {
      // console.error(error);
    }
  }
}
export default api
