var roleBuilder = require('role.builder');

function compare(a, b) {
  if ((a.hits / a.hitsMax) > (b.hits / b.hitsMax)) {
    return -1;
  }
  else if ((a.hits / a.hitsMax) < (b.hits / b.hitsMax)) {
    return 1;
  }
  else {
    return 0;
  }
}

module.exports = {
  run: function (creep) {
    // if creep is bringing energy to the spawn but has no energy left
    if (creep.memory.working === true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to transfer energy to the spwan
    if (creep.memory.working == true) {
      var walls = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
      });
      //walls.sort((a,b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax));
      walls.sort((a,b) => a.hits - b.hits);
      var target = walls[0];

      if (target) {
        // if target is found try to repair it or move to it if to far away
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
      // If no target can be found
      else {
        // start building
        roleBuilder.run(creep);
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      // find closest source
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      // try to harvest energy, if the source is not in range
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        // move towards source
        creep.moveTo(source);
      }
    }
  }
};
