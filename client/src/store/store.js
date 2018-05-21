import Vuex from 'vuex';
import MessageStore from '@/framework/store/messageStore';
import AuthStore from '@/framework/store/authStore';


const createStore = function store() {
  return new Vuex.Store({
    mutations: {
      increment(state) {
        state.count += 1;
      },
    },
    modules: {
      message: MessageStore,
      auth: AuthStore,
    },
  });
};

export default createStore;
