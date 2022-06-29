export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    port: 3001
  },
  head: {
    title: 'forum-portal',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      // {rel: 'stylesheet', href: 'https://at.alicdn.com/t/font_3295663_c5k65ip0u3a.css'}
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css',
    '@/assets/styles/global.css',
    '@/assets/styles/iconfont.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/element-ui',
    {src: '@/plugins/mavon-editor', ssr: false},
    '@/plugins/axios',
    '@/plugins/vueInject',
    {src: '@/assets/js/global.js', ssr: false},
    {src: "@/plugins/directive.js", ssr: false},
    {src: '@/plugins/echarts.js', ssr: false},
    {src: '@/plugins/echarts-word-cloud.js', ssr: false},
    {src: '@/plugins/social-share.js', ssr: false},
    {src: '@/plugins/bus.js'},
    {src: '@/assets/js/iconfont.js', ssr: false},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'cookie-universal-nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  // axios: {
  //   // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
  //   baseURL: 'http://127.0.0.1:9010'
  // },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/, 'echarts-wordcloud'],
  },

}
