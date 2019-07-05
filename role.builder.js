var roleUpgrader = require('role.upgrader');

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
      var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (constructionSite) {
        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
          // move towards the construction site
          creep.moveTo(constructionSite);
        } 
      }
      else {
        roleUpgrader.run(creep);
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      // find storage
      var storage  = creep.room.storage;
      // if  storage and has energy go get energy there
      if (storage && storage.store[RESOURCE_ENERGY] > 0) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage);
        }
      } 
      // if no storage or empty
      else {
        var containerWithEnergy = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: (c) => c.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
        });
        if (containerWithEnergy) {
          if (creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containerWithEnergy);
          }
        }
        // if no containers either
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
    }
  }
};

