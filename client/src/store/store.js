import Vuex from 'vuex';
import MessageStore from '@/framework/store/messageStore';
import AuthStore from '@/framework/store/authStore';
import config from '@/config';


const createStore = function store() {
  return new Vuex.Store({
    state: {
      version: config.version,
    },
    mutations: {
    },
    modules: {
      message: MessageStore,
      auth: AuthStore,
    },
  });
};

export default createStore;
