import Vuex from 'vuex';
import MessageStore from '@/framework/store/messageStore';


const createStore = function store() {
  return new Vuex.Store({
    state: {
      count: 0,
    },
    mutations: {
      increment(state) {
        state.count += 1;
      },
    },
    modules: {
      message: MessageStore,
    },
  });
};

export default createStore;
