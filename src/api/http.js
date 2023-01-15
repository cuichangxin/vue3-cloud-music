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

Axios.defaults.timeout = 10000
// 通用请求拦截器
Axios.interceptors.request.use(config => {
  pushTarget()
  return config
},
  err => {
    console.error(err)
    return Promise.reject(err)
  }
)
// 通用响应拦截器
Axios.interceptors.response.use(response => {
  popTarget()
  if (response.status !== 200) {
    return Promise.reject(response.data)
  }
  return response.data
},
  err => {
    popTarget()
    console.error(err)
    if (err && err.response && err.response.status) {
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
    return Promise.reject(err)
  }
)

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
      console.error(error);
    }
  }
}
export default api
