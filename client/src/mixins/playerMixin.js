import http from '@/framework/services/http';

const playerService = {
  create(name) {
    return http.post('player', { name });
  },
  find(query) {
    return http.get(`player/search/${query}`);
  },
  get(id) {
    return http.get(`player/${id}`);
  },
  filterPlayer(playerSuggestion, playerSlotArray) {
    let res = true;
    for (let i = 0; i < playerSlotArray.length; i += 1) {
      const player = playerSlotArray[i].player;
      if (player !== undefined && player._id === playerSuggestion.value._id) {
        res = false;
      }
    }
    return res;
  },
  focusPlayerSlot(playerSlotArray, refs, refPrefix) {
    // To the next undefined player
    for (let i = 0; i < playerSlotArray.length; i += 1) {
      const playerSlot = playerSlotArray[i];
      if (playerSlot.player === undefined) {
        refs[`${refPrefix}${playerSlot.index}`][0].editMode();
        return true;
      }
    }
    return false;
  },
};

export default {
  created() {
    this.playerService = playerService;
  },
};
