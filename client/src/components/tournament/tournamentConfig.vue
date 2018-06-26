<template>
  <div v-if="tournament" class="uk-card uk-card-default uk-card-body">
    <div  class="uk-margin">
      <span>{{ L.tournament_name }}</span><br/>
      <input  type="text"
        class='uk-input'
        v-model="tournament.name"
        data-validation-definition="validateRequired(tournament.name)"
        :placeholder="L.tournament_name" />
        {{ getValidationError('tournament') }}
    </div>

    <div class="uk-child-width-1-2@s" uk-grid>
      <div>
          <span>{{ L.number_of_tables }}</span><br/>
          <input  type="number"
            class='uk-input'
            v-model="tournament.nbTables"
            data-validation-definition="validatePositive(tournament.nbTables)"
            :placeholder="L.number_of_players" />
      </div>
      <div>
          <span>{{ L.number_of_rounds }}</span><br/>
          <input  type="number"
            class="uk-input"
            v-model="tournament.nbRounds"
            data-validation-definition="validatePositive(tournament.nbRounds)"
            :placeholder="L.number_of_rounds" />
      </div>
      <div>
          <span>{{ L.team_tournament }}</span><br/>
            <boolean-radio v-model="tournament.teamTournament"></boolean-radio>
      </div>
      <div>
        <div :hidden="tournament.teamTournament === false">
          <span>{{ L.teams_size }}</span><br/>
          <input  type="number"
  data-validation-definition="validateTeamsSize(tournament.teamsSize, tournament.teamTournament)"
            class="uk-input"
            v-model="tournament.teamsSize"
            :placeholder="L.teams_size" />
          </div>
      </div>
      <div>
        <span>{{ L['round_model'] }}</span><br/>
        <select class="uk-select"
          v-model="tournament.roundModel"
          data-validation-definition="validateRequired(tournament.roundModel)"
            >
          <option v-for="roundModel in roundModels"
            :key="roundModel.name"
            :value="roundModel">
            {{ L[`round_model_${roundModel.name}`] }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <br/>
     <button :disabled="!validationStatus.valid"
      class="uk-button uk-button-primary" @click="save()">
      {{ L.save }}
     </button>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/framework/mixins/formMixin';
import roundModels from '@/business/roundModels';
import PlayerChooser from '@/components/player/playerChooser';

export default {
  name: 'TournamentConfig',
  mixins: [FormMixin],
  props: ['tournament'],
  data() {
    return {
      roundModels,
      nbPlayers: 0,
    };
  },
  methods: {
    save() {
      if (this.validationStatus.valid) {
        this.$emit('save');
      }
    },
    validateTeamsSize(teamsSize, teamTournament) {
      return teamTournament === false || teamsSize > 0;
    },
  },
  components: {
    'player-chooser': PlayerChooser,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
