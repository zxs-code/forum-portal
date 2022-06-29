export const state = () => ({
  userInfo: null,
})

const USER_COOKIE_NAME = 'userInfo';

export const mutations = {
  setUserInfo(state, userInfo) {
    let expireAt = new Date(userInfo ? userInfo.expireAt : '2099-12-31');
    state.userInfo = userInfo;
    this.$cookies.set(USER_COOKIE_NAME, userInfo, {expires: expireAt});
  },
  removeUserInfo(state) {
    state.userInfo = null;
    this.$cookies.remove(USER_COOKIE_NAME);
  }
}

export const actions = {
  setUserInfo(context, userInfo) {
    context.commit('setUserInfo', userInfo)
  },
  removeUserInfo(context) {
    context.commit('removeUserInfo');
  }
}


export const getters = {
  getUserInfo: state => (that) => {
    return state.userInfo || that.$cookies.get(USER_COOKIE_NAME);
  }
}
