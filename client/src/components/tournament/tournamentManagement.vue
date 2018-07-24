<template>
  <div v-if="round!==undefined">
    <tabs :tabs='tabs' :value="currentRound" @input="switchTab($event)"></tabs>
      <round-preparation v-if="round.status==='preparation'"
        :tournament="tournament"
        :round="round"></round-preparation>
      <round-management v-if="round.status==='management'"
        :tournament="tournament"
        :round="round"></round-management>
  </div>
</template>

<script>
import FormMixin from '@/framework/mixins/formMixin';
import PlayerMixin from '@/mixins/playerMixin';
import { TournamentMixin } from '@/mixins/tournamentMixin';
import Tabs from '@/framework/components/tabs';
import roundModels from '@/business/roundModels';
import RoundPreparation from './roundPreparation';
import RoundManagement from './roundManagement';

export default {
  name: 'TournamentManagement',
  mixins: [FormMixin, TournamentMixin, PlayerMixin],
  props: ['tournament'],
  data() {
    return {
      currentRound: 0,
      roundModels,
    };
  },
  methods: {
    save(done) {
      this.messagePromiseCatcher(
        this.tournamentService.save(this.tournament._id, this.tournament).then(() => {
          if (done === true) this.$emit('saved');
        }));
    },
  },
  components: {
    tabs: Tabs,
    'round-preparation': RoundPreparation,
    'round-management': RoundManagement,
  },
  computed: {
    tabs() {
      const tabs = [];
      for (let i = 0; i < this.tournament.nbRounds; i += 1) {
        const id = i;
        const description = `${this.L.round} ${i + 1}`;
        const disabled = this.tournament.currentRound < i;
        tabs.push({ id, description, disabled });
      }
      return tabs;
    },
    round() {
      return this.tournament.rounds !== undefined ?
        this.tournament.rounds[this.currentRound] : undefined;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
