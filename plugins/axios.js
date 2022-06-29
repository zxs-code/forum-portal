// 如果在插件里面需要获取到 nuxt 本身
// 需要 export default


import {Message} from 'element-ui';

export default function ({$axios, redirect}) {
  // $axios.onError 是一个 nuxt 提供的辅助拦截器函数
  // 里面可以拦截到错误
  $axios.defaults.withCredentials = true;
  $axios.defaults.baseURL = 'http://localhost:9010';

  //samesite 策略问题 TODO

  $axios.onResponse(res => {
    let code = res.data.code;
    if (code === 0) ;
    else if (code === 1002) {
      // redirect('/login');
      window.location.href = '/login?redirect=' + window.location.href
    } else {
      Message.error(res.data.msg);
    }
  })
  $axios.onError(err => {
    Message.error('系统繁忙')
    // 如果需要跳转页面, 比如说需要跳转到登录页
    // 可以从 nuxt 中拿到 redirect 函数即可
    // redirect('/user/login')
  })

}
