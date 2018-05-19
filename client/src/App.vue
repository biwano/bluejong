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

export default {
  name: 'App',
  components: { navigation: Nav, messages: Messages },
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
