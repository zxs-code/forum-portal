export const state = () => ({
  isLogin: false,
  userInfo: null,
})

const SA_TOKEN = "satoken";
const USER_COOKIE_NAME = 'userInfo';

export const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    this.$cookies.set(USER_COOKIE_NAME, userInfo, {maxAge: 60 * 60 * 72});
  },
  removeUserInfo(state) {
    state.userInfo = null;
    state.isLogin = false;
    this.$cookies.remove(USER_COOKIE_NAME);
  }
}

export const actions = {
  setUserInfo(context, userInfo, expireAt) {
    context.commit('setUserInfo', userInfo, expireAt)
  },
  removeUserInfo(context) {
    context.commit('removeUserInfo');
  }
}


export const getters = {
  isLogin: state => (that) => {
    let token = that.$cookies.get(SA_TOKEN);
    return token != null;
  },
  getUserInfo: (state, getters) => (that) => {
    return getters.isLogin(that) ? state.userInfo || that.$cookies.get(USER_COOKIE_NAME) : null;
  }
}
