// Adds a messsage to a message list
const message = function message(messages, type, text) {
  messages.push({ type, text });
};
// Messae store
const messagesStore = {
  namespaced: true,
  state: {
    messages: [],
  },
  mutations: {
    error(state, text) {
      state.messages = [];
      message(state.messages, 'error', text);
      console.error(text);
    },
  },
};

// Mixin to be imported in Vue
export default messagesStore;
