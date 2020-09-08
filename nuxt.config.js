export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: {
    color: '#1890ff'
  },
  /*
  ** Global CSS
  */
  css: [
    'ant-design-vue/dist/antd.css',
    '@/assets/css/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/axios'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  router: {
    prefetchLinks: false,
    middleware: ['auth']
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
    timeout: 30000,
    // useCache: true
    retry: { retries: 2 },
    baseURL: process.env.BASE_URL
  },
  proxy: {
    '/api': {
      changeOrigin: true,
      target: process.env.API_URL,
      pathRewrite: {
        '^/api': '/v0'
      }
    }
  },
  auth: {
    cookie: {
      prefix: 'auth.',
      options: {
        maxAge: 60 * 60 * 24,
        path: '/',
        ...(function() {
          return process.env.NODE_ENV === 'production' ? {
            sameSite: 'none',
            // httpOnly: true,
            secure: true
          } : {}
        })()
      }
    },
    strategies: {
      local: {
        token: {
          property: 'result.token',
          // required: true,
          type: 'bearer',
          maxAge: 60 * 60 * 24
        },
        user: {
          property: 'result'
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/api/login', method: 'post' },
          logout: { url: '/api/login/logout', method: 'get' },
          user: { url: '/api/login/info', method: 'get' }
        }
      }
    },
    localStorage: false,
    rewriteRedirects: true,
    fullPathRedirect: true,
    resetOnError: true,
    redirect: {
      login: '/login',
      home: '/',
      logout: '/',
      callback: false
    }
  },
  storage: {
    vuex: {
      namespace: 'storage'
    },
    localStorage: {
      prefix: 'storage.'
    },
    cookie: {
      prefix: '',
      options: {
        path: '/',
        sameSite: 'none',
        // httpOnly: true,
        secure: true
      }
    },
    initialState: {
      // cartNumber: 0,
      postcode: 2000
    }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    extractCSS: true
  }
}
