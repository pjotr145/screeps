var roleMiner = {
  /** @param {Creep} creep **/
  run: function(creep) {
    var container = Game.getObjectById(creep.memory.containerId);
    var source = Game.getObjectById(creep.memory.sourceId);
    
    if (creep.pos.getRangeTo(container) == 0) {
      creep.memory.working = true;
      //creep.say('🚧 mine');
    } else {
      creep.memory.working = false;
      //creep.say('🔄 harvest');
    }

    if (creep.memory.working) {
      // should be on container so source in range of 1
      creep.harvest(source);
    }
    else {
      creep.moveTo(container);
    }
  }
};
    
module.exports = roleMiner;
    
    
/*    
    
    //creep.memory.working = false;
  	//var miners = creep.room.find(FIND_CREEPS, {
  	//	filter: (c) => c.memory.role == 'miner'
  	//})
  	// Find containers next to source
  	var containers = creep.room.find(FIND_STRUCTURES, {
  		filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.pos.findInRange(FIND_SOURCES, 1).length === 0
  	});
  	var targets = [];
  	for (let container of containers) {
  		// get creeps at container
  		var foundCreeps = container.pos.lookFor(LOOK_CREEPS);
  		if (found.length == 0 || found[0].memory.role != 'miner') {
  			//push container to targets
  			targets.push(container);
  		}
  	}
  	container = creep.pos.findClosestByRange(targets);
  	console.log(container)
    if(container && creep.pos.getRangeTo(container) == 0) {
      creep.memory.working = true;
      //creep.say('🚧 mine');
    } else {
      creep.memory.working = false;
      //creep.say('🔄 harvest');
    }    	
  	
    if(creep.memory.working) {
  	  // Since containers next to source use ClosestByRange
   	  var source = creep.pos.findClosestByRange(FIND_SOURCES);
   	  creep.harvest(source);
    } else {
  	  creep.moveTo(container);
    }
  }
};

module.exports = roleMiner;
*/
/*

// Om alle containers met een source er naast te vinden

let containers = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.pos.findInRange(FIND_SOURCES, 2).length === 0
});
*/
