import Vue from 'vue' 

Vue.prototype.$url  = `https://api.dev-canabit.xyz/`  //"https://www.admin-canabit.tk"//
Vue.prototype.$hover = 'transition transform hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:transform-none '
Vue.prototype.$card = 'rounded-xl shadow-2xl '
Vue.prototype.$comma = function Comma(Num:any)
{
      Num += '';
      Num = Num.replace(/,/g, '');
      let x:any 
      let x1:any 
      let x2:any
      x = Num.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1))
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
      return x1 + x2;
} 