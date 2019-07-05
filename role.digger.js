var roleDigger = {
  /** @param {Creep} creep **/
  run: function(creep) {
    var source = Game.getObjectById(creep.memory.sourceId);
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    };
  }
};

module.exports = roleDigger;
