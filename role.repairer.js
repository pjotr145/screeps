var roleBuilder = require('role.builder');

module.exports = {
  run: function (creep) {
    // if creep is bringing energy to the spawn but has no energy left
    if (creep.memory.working === true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to repair 
    if (creep.memory.working == true) {
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && !(s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
      });
      if (structure) {
        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structure, {visualizePathStyle: {stroke: '#FF0000'}});
        }
      }
      else {
        roleBuilder.run(creep);
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      // find storage
      var storage  = creep.room.storage;
      // if  storage and has energy go get energy there
      if (storage && storage.store[RESOURCE_ENERGY] > 0) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage, {visualizePathStyle: {stroke: '#FF0000'}});
        }
      } 
      // if no storage or empty
      else {
        var containerWithEnergy = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: (c) => c.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
        });
        if (containerWithEnergy) {
          if (creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containerWithEnergy, {visualizePathStyle: {stroke: '#FF0000'}});
          }
        }
        // if no containers either
        else {
          // find closest source
          var source = creep.pos.findClosestByPath(FIND_SOURCES);
          // try to harvest energy, if the source is not in range
          if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            // move towards source
            creep.moveTo(source, {visualizePathStyle: {stroke: '#FF0000'}});
          }
        }
      }
    }
  }
};
