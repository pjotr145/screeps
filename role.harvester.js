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
      // find my structures low on energy
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.energy < s.energyCapacity
      });
      if (structure) {
          // try to transfer energy, if the spawn is not in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards the spawn
          creep.moveTo(structure);
        } 
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      // Check if there are containers with energy stored
      var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
        filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                       i.store[RESOURCE_ENERGY] > 0
      });
      // if there are containersWithEnergy
      if (containersWithEnergy.length > 0) {
        //console.log('Containers with energy' + containersWithEnergy + 'tst');
        // find closest container with energy
        var container = creep.pos.findClosestByPath(containersWithEnergy);
        // try to withdraw energy, if the container is not in range
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards container
          creep.moveTo(container);
        }
      }
      // if no containersWithEnergy
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
};
