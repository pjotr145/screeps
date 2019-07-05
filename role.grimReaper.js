var grimReaper = {
  /** @param {Creep} creep **/
  run: function(creep) {
    //console.log("New Round")    	;
    if(!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('🔄 return');
    }
    if((creep.memory.working) && _.sum(creep.carry) == 0) {
      creep.memory.working = false;
      creep.say('🚧 harvest');
    }    	

    if(creep.memory.working) {
      // When bringing back to storage what has been found
      structure = creep.room.storage;
      if (structure) {
        switch(creep.transfer(structure, _.findKey(creep.carry))) {
          case ERR_NOT_IN_RANGE:
            creep.moveTo(structure, {visualizePathStyle: {stroke: '#000000'}});
            break;
          case OK:
            break;
          }
      }
      // if creep is empty start harvesting again
      total = _.sum(creep.carry);
      if(!total) {
        creep.memory.working = false;
      }
    }
    // If creep is supposed to harvest energy from tombstone
    else {
      var tombstones = creep.room.find(FIND_TOMBSTONES);
      for (let myTombstone of tombstones) {
        if (_.sum(myTombstone.store) > 0) {
          var targetTombstone = myTombstone;
          break;
        }
      }
	    if (targetTombstone) {	
	    	switch(creep.withdraw(targetTombstone, _.findKey(targetTombstone.store))){
	    		case ERR_NOT_IN_RANGE:
	    			creep.moveTo(targetTombstone, {visualizePathStyle: {stroke: '#000000'}});
	    			break;
	    		//default:
	    			//creep.memory.working = true;
	    	}
      }
      // if no tombstones found check for dropped resources
      else {
        resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (resource) {
          if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, {visualizePathStyle: {stroke: '#000000'}});
          }
        }
      }
    }
	}
};

module.exports = grimReaper;


/*
    RESOURCE_UTRIUM_HYDRIDE: "UH",
    RESOURCE_ZYNTHIUM_HYDRIDE: "ZH",
     RESOURCE_KEANIUM_OXIDE: "KO",
    RESOURCE_GHODIUM_OXIDE: "GO",
*/

