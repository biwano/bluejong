<template>
  <div v-if="tournament" class="uk-card uk-card-default uk-card-body">
    <div class="uk-margin">
       <span class="uk-card-title">{{ L.players }}</span><br/>
    </div>
    <div class="uk-child-width-1-4@s" uk-grid>
      <div v-for="playerSlot in tournament.playerSlots"
        :key="playerSlot.index">
        {{playerSlot.index + 1}}.&nbsp;
        <player-chooser
          v-model="playerSlot.player"
          @input="playerUpdated(playerSlot)"
          :suggestionFilter="playerSuggestionFilter"
          :placeholder="L.choose"
          :ref="`chooser${playerSlot.index}`">
        </player-chooser>
      </div>
    </div>
    <div class="uk-margin">
      <button :disabled="!ready"
        class="uk-button uk-button-primary" @click="save(true)">
        {{ L.save }}
      </button>
    </div>

  </div>
</template>

<script>
import FormMixin from '@/framework/mixins/formMixin';
import PlayerMixin from '@/mixins/playerMixin';
import { TournamentMixin } from '@/mixins/tournamentMixin';
import roundModels from '@/business/roundModels';
import PlayerChooser from '@/components/player/playerChooser';

export default {
  name: 'TournamentPreparation',
  mixins: [FormMixin, TournamentMixin, PlayerMixin],
  props: ['tournament'],
  data() {
    return {
      roundModels,
    };
  },
  methods: {
    playerUpdated() {
      this.playerService.focusPlayerSlot(this.tournament.playerSlots, this.$refs, 'chooser');
      this.save();
    },
    save(done) {
      if (done === true) this.tournament.status = 'management';
      this.messagePromiseCatcher(
        this.tournamentService.save(this.tournament._id, this.tournament).then(() => {
          if (done === true) this.$emit('saved');
        }));
    },
    // Filters players already selected
    playerSuggestionFilter(playerSuggestion) {
      return this.playerService.filterPlayer(playerSuggestion, this.tournament.playerSlots);
    },
  },
  components: {
    'player-chooser': PlayerChooser,
  },
  computed: {
    nbChosenPlayers() {
      return this.tournament.playerSlots.filter(slot => slot.player !== undefined).length;
    },
    ready() {
      return this.nbChosenPlayers === this.tournament.playerSlots.length;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
