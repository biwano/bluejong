<template>
    <ul uk-tab>
      <li v-for="tab in tabs" :key="tab.id"
        :class="{ active: tab.id === value, 'uk-active': tab.id === value }"
        @click="selectTab(tab)">
        <a>{{ L[tab.description] }}</a>
      </li>
    </ul>
</template>

<script>

export default {
  name: 'Tabs',
  props: ['tabs', 'value'],
  methods: {
    selectTab(tab) {
      this.$emit('input', tab.id);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
