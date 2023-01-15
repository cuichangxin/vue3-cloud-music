const serviceList = {
  development:{
    defaultApi:'http://localhost:3000'
  },
  production:{
    defaultApi:'http://localhost:3000'
  }
}
const env = process.env.NODE_ENV
export default {
  baseURL:serviceList[env]
}