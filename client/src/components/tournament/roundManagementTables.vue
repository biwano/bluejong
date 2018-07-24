<template>
  <div >
    <table class="uk-table uk-table-divider uk-table-hover uk-table-middle">
      <tbody>
        <tr v-for="table in tables" :key="table.index">
          <th>{{ table.index + 1 }}</th>
          <td>
            <span
              v-for="playerSlotIndex in table.playerSlotIndexes"
              :key="playerSlotIndex">
              <span class="uk-badge">
                {{ tournament.playerSlots[playerSlotIndex].player.name }}
              </span>&nbsp;
            </span>
          </td>
          <td>
            <icon icon="pencil" @click="goToTableGame(table)"></icon>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { TournamentMixin } from '@/mixins/tournamentMixin';
import GameMixin from '@/mixins/gameMixin';

export default {
  name: 'RoundManagementTables',
  mixins: [TournamentMixin, GameMixin],
  props: ['round', 'tournament'],
  components: {
  },
  methods: {
    goToTableGameBE(table) {
      this.$router.push({ name: 'Game', params: { id: table.game_id } });
    },
    goToTableGame(table_) {
      const table = table_;
      // Create game if it does not exist
      if (table.game_id === undefined) {
        this.gameService.createForTournament(this.tournament,
          this.round.index,
          table.index).then((game) => {
          table.game_id = game._id;
          this.tournamentService.updateTable(this.tournament._id,
            this.round.index,
            table.index,
            table);

          this.goToTableGameBE(table);
        });
      } else {
        this.goToTableGameBE(table);
      }
    },
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
