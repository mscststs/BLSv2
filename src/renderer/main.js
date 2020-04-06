import Vue from 'vue'
import axios from 'axios'

import App from './App'
import api from './utils/api'
import eve from './utils/events'
import Store from './utils/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(Object.keys(fas).map(v => fas[v]))
Vue.component('ficon', FontAwesomeIcon)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$eve = eve
Vue.prototype.$store = new Store(localStorage, 'BLS-config-v2')

/**
 * Focus : v-focus , auto Focus Element
 */
Vue.directive('focus', {
  inserted: function (el, binding) {
    if (
      (binding.expression && binding.value) ||
      (!binding.expression)
    ) {
      el.focus()
    }
  }
})
/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
