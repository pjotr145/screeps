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
      // try to transfer energy, if the spawn is not in range
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        // move towards the spawn
        creep.moveTo(creep.room.controller);
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      // Check if there is a storage with energy
      let storage = creep.room.storage;
      if (storage && storage.store[RESOURCE_ENERGY] > 0) {
        //var containersWithEnergy = storage;
        //console.log('Found full storage')
        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage)
        }
      }
      // if no storage or storage is empty
      else {
        // Check if there are containers with energy stored
        var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
          filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                         i.store[RESOURCE_ENERGY] > 0
        });
        // if there are containersWithEnergy
        if (containersWithEnergy) {
          //console.log('Container is ' + containersWithEnergy)
          // find closest container with energy
          var container = creep.pos.findClosestByPath(containersWithEnergy);
          // try to withdraw energy, if the container is not in range
          //console.log('Source Container is ' + container)
          if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            // move towards container
            creep.moveTo(container);
          }
        }
        // if no containersWithEnergy
        else {
          // find closest source
          var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
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
