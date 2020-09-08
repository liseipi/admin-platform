import qs from 'qs'
import { notification } from 'ant-design-vue'

export default function({ $axios, redirect, $cookies }) {

  /*
  ** spa page axios config
  */
  $axios.defaults.timeout = 50000
  $axios.defaults.baseURL = process.env.BASE_URL

  $axios.onRequest((config) => {
    if (!(typeof (config.url) == 'string')) {
      config.url = '/api/'
    }
    if (config.hasOwnProperty('params') && Object.keys(config.params).length > 0) {
      Object.keys(config.params).forEach((key, index) => {
        if (config.url.indexOf(key) != -1) {
          config.url = config.url.replace(new RegExp(':' + key, 'ig'), config.params[key].toString())
        }
      })
    }
    if (config.method.toUpperCase() == 'POST' && config.hasOwnProperty('responseType') && config.responseType == 'stream') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    }
    // console.log(config.url)
    return config
  })

  $axios.onError((err) => {
    console.error({ api: err.config.url })

    if (err.hasOwnProperty('response') && err.response) {
      let { status, statusText, config: { url } } = err.response
      if (err.response.hasOwnProperty('data') && err.response.data.hasOwnProperty('statusText')) {
        statusText = err.response.data.statusText
      }

      if (status == 403) {
        notification.error({
          message: '认证失败!',
          description: '当前用户操作权限失败。'
        })
      //   $cookies.removeAll()
      //   return redirect('/login')
      }

      // Toast.fail(statusText)
      return Promise.resolve({ statusCode: status, message: statusText, path: url })
    }

    if (err.hasOwnProperty('isAxiosError') && err.isAxiosError) {
      // Toast.fail(err.code)
      return Promise.resolve({ statusCode: 500, message: err.code || 'Interface request address error', path: err.config.url })
    }
  })

  $axios.interceptors.response.use(async response => {
    return response
  }, err => {
    return Promise.reject(err)
  })

}
