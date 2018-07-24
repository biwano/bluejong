<template>
  <div @keyup.enter="save()" class="uk-margin-left uk-margin-right">
    <div  class="uk-margin">
      <span>{{ L.tournament_name }}</span><br/>
      <input  type="text"
        class='uk-input'
        v-model="tournament.name"
        data-validation-definition="validateRequired(tournament.name)"
        :placeholder="L.tournament_name"
        />
        {{ getValidationError('tournament') }}
    </div>

    <div class="uk-child-width-1-2@s" uk-grid>
      <div>
          <span>{{ L.number_of_tables }}</span><br/>
          <input  type="number"
            class='uk-input'
            v-model="tournament.nbTables"
            :placeholder="L.number_of_players"
             />
      </div>
      <div>
          <span>{{ L.number_of_rounds }}</span><br/>
          <input  type="number"
            class="uk-input"
            v-model="tournament.nbRounds"
            data-validation-definition="validatePositive(tournament.nbRounds)"
            :placeholder="L.number_of_rounds"
            />
      </div>
      <!--
      <div>
          <span>{{ L.team_tournament }}</span><br/>
            <boolean-radio v-model="tournament.teamTournament"
            @keyup.enter="save()"></boolean-radio>
      </div>
      <div>
        <div :hidden="tournament.teamTournament === false">
          <span>{{ L.teams_size }}</span><br/>
          <input  type="number"
  data-validation-definition="validateTeamsSize(tournament.teamsSize, tournament.teamTournament)"
            class="uk-input"
            v-model="tournament.teamsSize"
            :placeholder="L.teams_size"
            @keyup.enter="save()"/>
          </div>
      </div>
    -->

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
import { TournamentMixin } from '@/mixins/tournamentMixin';
import roundModels from '@/business/roundModels';

export default {
  name: 'TournamentConfig',
  mixins: [FormMixin, TournamentMixin],
  props: ['tournament'],
  data() {
    return {
      roundModels,
    };
  },
  methods: {
    save() {
      if (this.validationStatus.valid) {
        this.$nextTick(() => {
          this.tournamentService.adjustPlayers(this.tournament);
          this.tournamentService.adjustRounds(this.tournament);
          this.tournament.status = 'preparation';
          this.messagePromiseCatcher(
            this.tournamentService.save(this.tournament._id, this.tournament).then(() => {
              this.$emit('saved');
            }));
        });
      }
    },
    validateTeamsSize(teamsSize, teamTournament) {
      return teamTournament === false || teamsSize > 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
