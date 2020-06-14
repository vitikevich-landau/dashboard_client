import Vue from 'vue'
import App from './App.vue'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import '@/css/dashboard.css';

import 'vue-multiselect/dist/vue-multiselect.min.css';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
