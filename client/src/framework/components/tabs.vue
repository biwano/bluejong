<template>
    <ul uk-tab>
      <li v-for="tab in tabs" :key="tab.id"
        :class="tabClass(tab)"
        @click="selectTab(tab)">
        <a>{{ label(tab.description) }}</a>
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
    tabClass(tab) {
      return { active: tab.id === this.value,
        'uk-active': tab.id === this.value,
        'uk-disabled': tab.disabled === true,
      };
    },
    label(description) {
      const l = this.L[description];
      return l !== undefined ? l : description;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
