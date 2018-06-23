module.exports = {
  preSave(object_) {
    const object = object_;
    const date = new Date();
    if (object.isNew) {
      object.created = date;
    }
    object.updated = date;
  },
  packPlayers(playerSlots) {
  	for (let i = 0; i < playerSlots.length; i += 1) {
      const slot = playerSlots[i];
      if (slot.player !== undefined && slot.player._id !== undefined) {
        slot.player = slot.player._id;
      }
    }
  },
};
