export default {
  created() {
    this.clearMessages();
  },
  methods: {
    clearMessages() {
      this.$store.commit('message/clear');
    },
    displayMessage(type, text) {
      this.$store.commit('message/message', { type, text });
    },
    displayInfo(text) {
      this.displayMessage('info', text);
    },
    displayError(text) {
      this.displayMessage('error', text);
    },
  },
};
