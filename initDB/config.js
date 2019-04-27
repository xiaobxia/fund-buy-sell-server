const axios = require('axios')
const qs = require('qs')
const sourceDBAddress = 'http://47.98.140.76:3006/myService/'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieGlhb2J4aWEiLCJpYXQiOjE1NDgyMjA4MTUsImV4cCI6MTU1MDgxMjgxNX0.P0CF1hEHA50Xb-Cmqofk_rNDLaRdfRxxrD-DDMql14E'

axios.interceptors.request.use(function (config) {
  config.headers.token = token
  return config
}, function (error) {
  return Promise.reject(error)
})

function makeUrl (url) {
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  } else {
    return `${sourceDBAddress}${url}`
  }
}
exports.get = function (url, query, options) {
  let queryString = ''
  if (query) {
    query.timestamp = new Date().getTime()
    queryString = qs.stringify(query)
  } else {
    queryString = qs.stringify({ timestamp: new Date().getTime() })
  }
  return axios.get(makeUrl(url + (queryString ? '?' + queryString : '')), options).then(data => data.data)
}

// 本项目的
exports.userId = '5c4a81b4f9a9a8288c7f28a1'
