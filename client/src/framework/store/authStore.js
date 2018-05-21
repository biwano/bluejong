// Auth store
const authStore = {
  namespaced: true,
  state: {
    user: {},
  },
  getters: {
    name: state => (state.user !== undefined ? state.user.name : ''),
    type: state => (state.user !== undefined ? state.user.type : ''),
  },
  mutations: {
    authenticate(state, user) {
      state.user = user;
    },
  },
};

// Mixin to be imported in Vue
export default authStore;
