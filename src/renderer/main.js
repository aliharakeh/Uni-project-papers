import Vue from 'vue'

import App from './App'
import router from './router'
// import store from './store'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import db from './database'
import store from './store'

Vue.prototype.$db = db

Vue.use(Vuetify, {
  rtl: true
})
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
  // created () {
  //   this.$store.dispatch('loadDocs')
  // }
}).$mount('#app')
