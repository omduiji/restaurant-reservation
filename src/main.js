import Vue from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { ValidationProvider } from 'vee-validate';



Vue.config.productionTip = false

Vue.component('MultiSelectDropdown', Multiselect)
Vue.component('ValidationProvider', ValidationProvider);

new Vue({
  render: h => h(App),
}).$mount('#app')
