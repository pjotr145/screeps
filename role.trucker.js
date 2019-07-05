module.exports = {
  run: function (creep) {
    // if creep is bringing energy to the spawn but has no energy left
    if (creep.memory.working === true && _.sum(creep.carry) == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is collecting energy and is full
    else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }
    var structure = [];

    // if creep is supposed bring back energy to the spawn....
    if (creep.memory.working == true) {
      // try to find spawn/extension/tower with less than max energy
      structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
                        s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_TOWER) &&
                        s.energy < s.energyCapacity
      });
      //console.log('Spawns etc: ' + structure)
      // if no spawn/extension try to find a STRUCTURE_STORAGE
      if (!structure) {
        structure = creep.room.storage;
        //console.log('Maybe a storage: ' + structure)
      }
      // if no target found yet try to find upgrader to transfer energy to
      if (!structure) {
        structure = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
          filter: (c) => c.memory.role == 'upgrader' ||
                         c.memory.role == 'builder' ||
                         c.memory.role == 'repairer'
        })
        //console.log('Upgraders: ' + structure)
      }
      //console.log('Final structure: ' + structure)
      if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(structure, {visualizePathStyle: {stroke: '#FFFF00'}});
      }
    }
    // if creep is supposed to pickup dropped resources
    else {
      // get digger for this creep
      targetDigger = Game.getObjectById(creep.memory.diggerId);
      if (!targetDigger) {
        creep.suicide();
      }
      if (creep.pos.getRangeTo(targetDigger) > 4) {
        creep.moveTo(targetDigger, {visualizePathStyle: {stroke: '#FFFF00'}});
      }
      else {
        resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (resource) {
          if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, {visualizePathStyle: {stroke: '#FFFF00'}});
          }
        }
      }
    }
  }
};
