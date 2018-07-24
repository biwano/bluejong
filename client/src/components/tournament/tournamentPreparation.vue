<template>
  <div class="uk-margin-left uk-margin-right">
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
    <hr/>
    <div>
      <span>{{ L['round_model'] }}</span><br/>
      <select class="uk-select"
        v-model="tournament.roundModel"
        data-validation-definition="validateRequired(tournament.roundModel)"
          >
        <option v-for="roundModel in roundModels"
          :key="roundModel.name"
          :value="roundModel"
          @keyup.enter="save()">
          {{ L[`round_model_${roundModel.name}`] }}
        </option>
      </select>
    </div>
    <div class="uk-margin">
      <button :disabled="!ready"
        class="uk-button uk-button-primary" @click="save(true)">
        {{ L.tournament_start }}
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
      let promise;
      const id = this.tournament._id;
      if (done === true) {
        this.tournament.status = 'management';
        promise = this.tournamentService.save(id, this.tournament)
          .then(() => {
            this.tournamentService.getRounds(id)
              .then((rounds) => {
                this.tournament.rounds = rounds;
                this.tournamentService.save(id, this.tournament)
                  .then(() => this.$emit('saved'));
              });
          });
      } else promise = this.tournamentService.save(id, this.tournament);
      this.messagePromiseCatcher(promise);
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
      return this.validationStatus.valid
        && this.nbChosenPlayers === this.tournament.playerSlots.length;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
