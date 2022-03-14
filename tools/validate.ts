import Vue from 'vue' 

Vue.prototype.$required = (value:any) => !!value || 'Required.'
Vue.prototype.$email = (value:any) => !!value || 'Required.'