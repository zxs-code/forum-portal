export default function (context) {
  let path = context.route.path;
  let isLogin = context.store.getters['user/isLogin'](context);
  if (needLoginPath(path) && !isLogin) {
    context.redirect('/login?redirect=' + path);
  }
}
const loginPath = [
  '/posts/edit/{id}',
  '/posts/create',
  '/user/index',
  '/user'
];

const loginPathPattern = [];

for (let index in loginPath) {
  loginPathPattern.push(new RegExp('^' + loginPath[index].replace('{.*}', '[^/]*')));
}

// 当前访问URL是否需要登录访问
function needLoginPath(path) {
  for (let i in loginPathPattern) {
    let pattern = loginPathPattern[i];
    if (pattern.test(path))
      return true;
  }
  return false;
}

