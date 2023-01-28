import Vue from 'vue'
import Preloader from '~/components/preloader.vue'
import error from '~/components/error.vue'
import alert from '~/components/alert.vue'
import notfound from '~/components/notfound.vue'
import ratesettings from '~/components/ratesettings.vue'
import leaguesettings from '~/components/leaguesettings.vue'
import marketsettings from '~/components/marketsettings.vue'

Vue.component('preloader', Preloader)
Vue.component('error', error)
Vue.component('alert', alert)
Vue.component('notfound', notfound)
Vue.component('ratesettings', ratesettings)
Vue.component('leaguesettings', leaguesettings)
Vue.component('marketsettings', marketsettings)