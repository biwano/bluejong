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
    this.authGetUserInfo();
  },
};
</script>

<style>
#app {
}
.button-submit {
  margin-top:16px;
}
</style>
