<template>
  <div>
    <div v-for="message in messages" :key="message.id"
      :class="computeClass(message.type)" uk-alert>
        {{ L[message.text] }}
        <a class="uk-alert-close" uk-close></a>
      </div>
  </div >
</template>

<script>
export default {
  name: 'Messages',
  props: ['messages'],
  methods: {
    computeClass(type) {
      const uktype = { error: 'danger',
        info: 'primary' }[type];
      return `uk-alert-${uktype}`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
