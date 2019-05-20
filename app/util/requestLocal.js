const reqlib = require('app-root-path').require
const config = reqlib('/config/index')
const axios = require('axios')
const qs = require('qs')
const address = `http://localhost:${config.server.port || 8080}/${config.project.projectName}/`

function makeUrl (url) {
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  } else {
    return `${address}${url}`
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

exports.post = function (url, param, options) {
  return axios.post(makeUrl(url), qs.stringify(param), options).then(data => data.data)
}
