import minEncountersRoundModel from './minEncountersRoundModel';

const roundModelBase = {

};
const roundModels = {};
const appendRoundModel = function appendRoundModel(roundModel_) {
  const roundModel = Object.assign({}, roundModelBase, roundModel_);
  roundModels[roundModel.name] = roundModel;
};
appendRoundModel(minEncountersRoundModel);

export default roundModels;
