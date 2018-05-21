<template>
  <div id="app">
    <navigation></navigation>
    <messages :messages="$store.state.message.messages"></messages>
    <router-view/>
  </div>
</template>

<script>
import Messages from '@/framework/components/messages';
import Nav from '@/components/nav';
import AuthMixin from '@/framework/mixins/authMixin';

export default {
  name: 'App',
  mixins: [AuthMixin],
  components: { navigation: Nav, messages: Messages },
  created() {
    this.authService.getUserInfo().then((response) => {
      if (response.status !== 'ko') {
        this.$store.commit('auth/authenticate', response.data);
      }
    }).catch(() => {
      this.messagesService.error('unexpected_error');
    });
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
