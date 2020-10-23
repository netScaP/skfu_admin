import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/ru-RU' // lang i18n

import '@/styles/index.scss' // global css
import feathersClient from './utils/feathers-client'

import App from './App'
import router from './router'
import store from './store'

import * as VueGoogleMaps from 'vue2-google-maps'

import { toDateFormat } from './globalFilters/timeFilters'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

import vSelect from '@/components/select'
Vue.component('v-select', vSelect)
import 'vue-select/dist/vue-select.css'

Vue.filter('toDateFormat', toDateFormat)

Vue.config.productionTip = false

Vue.prototype.$apiClient = feathersClient

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAP_API_KEY,
    libraries: 'places', // necessary for places input
  },
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
