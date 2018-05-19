<template>
  <div id="app">
    <messages :messages="$store.state.message.messages"></messages>
    <router-view/>
  </div>
</template>

<script>
import Messages from '@/framework/components/messages';

export default {
  name: 'App',
  components: { messages: Messages },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
