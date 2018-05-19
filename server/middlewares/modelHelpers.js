module.exports = {
  preSave(object_) {
  	const object = object_;
    const date = new Date();
    if (object.isNew) {
      object.created = date;
    }
    object.updated = date;
  },
};
