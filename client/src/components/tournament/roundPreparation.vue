<template>
  <div>
  </div>
</template>

<script>
import FormMixin from '@/framework/mixins/formMixin';
import PlayerMixin from '@/mixins/playerMixin';
import { TournamentMixin } from '@/mixins/tournamentMixin';
import roundModels from '@/business/roundModels';

export default {
  name: 'RoundPreparation',
  mixins: [FormMixin, TournamentMixin, PlayerMixin],
  props: ['tournament'],
  data() {
    return {
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
  },
  computed: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
