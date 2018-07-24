<template>
  <div>
    <tabs :tabs='tabs' :value="tab" @input="switchTab($event)"></tabs>
    <round-management-tables v-if="tab==='tables'"
      :tournament="tournament"
      :round="round"></round-management-tables>
  </div>
</template>

<script>
import Tabs from '@/framework/components/tabs';
import RoundManagementTables from './roundManagementTables';

export default {
  name: 'RoundManagement',
  mixins: [],
  props: ['tournament', 'round'],
  data() {
    return {
      tabs: [{ id: 'tables', description: 'tables' }],
      tab: 'tables',
    };
  },
  methods: {
  },
  components: {
    tabs: Tabs,
    'round-management-tables': RoundManagementTables,
  },
  computed: {
    tables() {
      return this.round.tables;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
