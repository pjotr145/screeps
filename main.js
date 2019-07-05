// Import modules
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleMiner = require('role.miner');
var roleLorry = require('role.lorry');
var roleDigger = require('role.digger');
var roleTrucker = require('role.trucker');
var roleGrimeReaper = require('role.grimReaper');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');

var HOME = 'W6N1'


	
module.exports.loop = function () {
	//console.log("Start of loop");
	// Clear memory
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			console.log("Deleted: " + name);
			delete Memory.creeps[name];
		}
	};

	// for every creep in the game
  for(var name in Game.creeps) {
    // get the creep object
    var creep = Game.creeps[name];
    // if creep is a harvester, call harvester script etc.
    switch (creep.memory.role) {
      case 'harvester':    roleHarvester.run(creep); break;
      case 'upgrader':     roleUpgrader.run(creep); break;
      case 'builder':      roleBuilder.run(creep); break;
      case 'repairer':     roleRepairer.run(creep); break;
      case 'wallRepairer': roleWallRepairer.run(creep); break;
      case 'miner':        roleMiner.run(creep); break;
      case 'lorry':        roleLorry.run(creep); break;
      case 'digger':       roleDigger.run(creep); break;
      case 'trucker':      roleTrucker.run(creep); break;
      case 'grimReaper':   roleGrimeReaper.run(creep); break;
      case 'longDistanceHarvester': roleLongDistanceHarvester.run(creep); break;
    }
  };

  // find all towers
  var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  // for each tower
  for (let tower of towers) {
    // find close hostile creep
    var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    // if hostile creep is found
    if (target) {
      // ...FIRE
      tower.attack(target);
    }
  }


  for (let spawnName in Game.spawns) {
    let spawn = Game.spawns[spawnName];

    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
    var name = -1;
    var minerSource = false
    var energyInRoomAvailable = spawn.room.energyAvailable;
    var energyRoomCapacity = spawn.room.energyCapacityAvailable;
    
    // Current number of different types of creeps
    var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'wallRepairer');
    var numberOfMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'miner');
    var numberOfLorries = _.sum(creepsInRoom, (c) => c.memory.role == 'lorry');
    var numberOfDiggers = _.sum(creepsInRoom, (c) => c.memory.role == 'digger');
    var numberOfTruckers = _.sum(creepsInRoom, (c) => c.memory.role == 'trucker');
    var numberOfGrimReapers = _.sum(creepsInRoom, (c) => c.memory.role == 'grimReaper');
    var numberOfLongDistanceHarvestersW7N3 = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' &&
                                                                       c.memory.targetRoom == 'W7N3');
    
    
    // Spawn missing amount of creeps
    if (numberOfHarvesters < spawn.memory.minHarvesters && (numberOfMiners == 0 || numberOfLorries ==0)) {
      name = 'Harvester'+Game.time.toString(); 
      let spawnCreepResult = spawn.spawnCustomCreep(energyInRoomAvailable, 'harvester', name);
      if (spawnCreepResult != OK) {
        name = -1;
        ////console.log("Spawn van harvester is mislukt" + spawnCreepResult);
      };
      //console.log("Spawned a new creep: Harvester");
    } 
     else if (numberOfLorries < numberOfMiners) {
       name = 'Lorry'+Game.time.toString(); 
       // find all miners in the room
       var miners = spawn.room.find(FIND_MY_CREEPS, {
         filter: (c) => c.memory.role == 'miner'
       });
       for (let miner of miners) {
         currentContainerId = miner.memory.containerId;
         //console.log('Current container id: ' + currentContainerId)
         // find creeps with role lorry and containerId same as current miner
         creepsWithContainer = spawn.room.find(FIND_MY_CREEPS, {
           filter: (c) => c.memory.role == 'lorry' &&
                          c.memory.containerId == currentContainerId
         });
         //console.log('Aant creeps met id: ' + creepsWithContainer.length)
         // if no lorries with this container are found it is set as the targetContainer
         if (creepsWithContainer.length ==  0) {
           var targetContainer = currentContainerId;
           //console.log('Target container: ' + targetContainer)
           //break;
         }
       }
       // function (energy, roleName, name, targetContainer) 
       if (targetContainer) {
         var spawnCreepResult = spawn.spawnLorry(energyRoomCapacity, 'lorry', name, targetContainer);
       }
       if (spawnCreepResult != OK) {
         name = -1;
         //console.log("Spawn van lorry is mislukt" + spawnCreepResult);
       };
        //console.log("Spawned a new creep: Lorry "+numberOfRepairers); 
    } 
    else if (numberOfMiners < spawn.memory.minMiners && spawn.room.energyAvailable > 350) {
      // Find a container next to a source but without a miner on top of it. Returns 1 minerTarget
      // Find all sources in this room
      let sources = spawn.room.find(FIND_SOURCES);
      // loop through all the sources
      for (let source of sources) {
        // if there are no creeps with role miner and sourceId same as source's.
        if (!_.some(creepsInRoom, (c) => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
          // find containers within range 1 of source
          let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER
          });
          // if there are containers found set matching source's id to miner target.
          // (assumption only one container per source)
          if (containers.length > 0) {
            minerSource = source.id;
            minerContainer = containers[0].id;
            //console.log('Miner target: ' + minerTarget);
            // only one target should be set so no need to check further sources for this creep
            break;
          }
        }
      }
        name = 'Miner'+Game.time.toString(); 
      // function (energy, roleName, name, minerTarget)
      let spawnCreepResult = spawn.spawnMiner('miner', name, minerSource, minerContainer);
      if (spawnCreepResult != OK) {
        name = -1;
        //console.log("Spawn van miner is mislukt" + spawnCreepResult);
      };
        //console.log("Spawned a new creep: Miner "+numberOfRepairers);
     }
    else if (numberOfUpgraders < spawn.memory.minUpgraders) {
      name = 'Upgrader'+Game.time.toString();
      let spawnCreepResult = spawn.spawnUpgrader(energyRoomCapacity, 'upgrader', name);
      if (spawnCreepResult != OK) {
        name = -1;
        //console.log("Spawn van upgrader is mislukt" + spawnCreepResult);
      };    	
      //console.log("Spawned a new creep: Upgrader");
    } else if (numberOfBuilders < spawn.memory.minBuilders) {
      name = 'Builder'+Game.time.toString();
      let spawnCreepResult = spawn.spawnCustomCreep(energyRoomCapacity, 'builder', name);
      if (spawnCreepResult != OK) {
        name = -1;
        //console.log("Spawn van builder is mislukt" + spawnCreepResult);
      };
      //console.log("Spawned a new creep: Builder "+numberOfBuilders);
    } else if (numberOfRepairers < spawn.memory.minRepairers) {
        name = 'Repairer'+Game.time.toString(); 
      let spawnCreepResult = spawn.spawnCustomCreep(energyRoomCapacity, 'repairer', name);
      if (spawnCreepResult != OK) {
        name = -1;
        //console.log("Spawn van repairer is mislukt" + spawnCreepResult);
      };
        //console.log("Spawned a new creep: Repairer "+numberOfRepairers);
    } else if (numberOfWallRepairers < spawn.memory.minWallRepairers) {
      name = 'wallRepairer'+Game.time.toString(); 
      let spawnCreepResult = spawn.spawnCustomCreep(energyRoomCapacity, 'wallRepairer', name);
      if (spawnCreepResult != OK) {
        name = -1;
        //console.log("Spawn van WallRepairer is mislukt" + spawnCreepResult);
      };
        //console.log("Spawned a new creep: WallRepairer "+numberOfWallRepairers);
      } 
    else if (numberOfGrimReapers < spawn.memory.minGrimReapers && spawn.room.energyAvailable > 400) {
      name = 'GrimReaper'+Game.time.toString(); 
      // function (energy, roleName, name, minerTarget)
      let spawnCreepResult = spawn.spawnGrimReaper('grimReaper', name);
      if (spawnCreepResult != OK) {
        name = -1;
        //console.log("Spawn van miner is mislukt" + spawnCreepResult);
      };
        //console.log("Spawned a new creep: Miner "+numberOfRepairers);
     }
    else if (numberOfTruckers < numberOfDiggers) {
      name = 'Trucker' + Game.time.toString();
      // find all diggers in the room
      var diggers = spawn.room.find(FIND_MY_CREEPS, {
        filter: (c) => c.memory.role == 'digger'
      });
      for (let digger of diggers) {
        diggerId = digger.id;
        // find all truckers with diggerId == digger.id
        var truckerWithDigger = spawn.room.find(FIND_MY_CREEPS, {
          filter: (c) => c.memory.diggerId == diggerId
        });
        breaktrucker: if (truckerWithDigger.length == 0) {
          var targetDigger = digger.id;
          break breaktrucker;
        }
      }
      let spawnCreepResult = spawn.spawnTrucker(energyRoomCapacity, 'trucker', name, targetDigger)
       if (spawnCreepResult != OK) {
         name = -1;
         //console.log("Spawn van trucker is mislukt" + spawnCreepResult);
       };
        //console.log("Spawned a new creep: Trucker "+numberOfRepairers); 
    }
    else if (numberOfDiggers < spawn.memory.minDiggers && spawn.room.energyAvailable > 350) {
      // Find a container next to a source but without a miner/digger next top of it. Returns 1 minerTarget
      // Find all sources in this room
      let sources = spawn.room.find(FIND_SOURCES);
      // loop through all the sources
      for (let source of sources) {
        // if there are no creeps with role miner/digger and sourceId same as source's.
        if (!_.some(creepsInRoom, (c) => (c.memory.role == 'miner' ||
                                          c.memory.role == 'digger') && 
                                          c.memory.sourceId == source.id)) {
          minerSource = source.id;
          //console.log('Miner target: ' + minerTarget);
          // only one target should be set so no need to check further sources for this creep
          break;
          }
        }
      
        name = 'Digger'+Game.time.toString(); 
      // function (energy, roleName, name, minerTarget)
      let spawnCreepResult = spawn.spawnMiner('digger', name, minerSource);
      if (spawnCreepResult != OK) {
        name = -1;
        //console.log("Spawn van digger is mislukt" + spawnCreepResult);
      };
        //console.log("Spawned a new creep: Digger "+numberOfRepairers);
     }
    else if (numberOfLongDistanceHarvestersW7N3 < spawn.memory.minLDH_W7N3 && energyInRoomAvailable >= 1250) {
      console.log('Need for LDH is here')
      // check if enough energy should at least be able te get 5 WORK + 5 CARRY + 10 MOVE = 1250
      name = 'LongDistHarvester'+Game.time.toString();
      // function (energy, roleName, name, numberOfWorkParts, home, target, sourceIndex)
      let spawnCreepResult = spawn.spawnLongDistanceHarvester(energyInRoomAvailable, 
                                          'longDistanceHarvester', 
                                          name, 
                                          5, 
                                          'W7N4', //HomeRoom
                                          'W7N3', //TargetRoom
                                          0);

      if (spawnCreepResult != OK) {
        name = -1;
        console.log("Spawn van longDistanceHarvester is mislukt" + spawnCreepResult);
      };
    } else {
      name = -1;
    };
    
    
    // Print name to console if spawning was a succes
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0)) {
      console.log(spawnName + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
      //console.log("Spawn1 spawned new creep: " + name+" "+Game.creeps[0]);
      console.log(spawnName + ": Harvesters    : " + numberOfHarvesters + ' of ' + spawn.memory.minHarvesters);
      console.log(spawnName + ": Builders      : " + numberOfBuilders + ' of ' + spawn.memory.minBuilders);
      console.log(spawnName + ": Upgraders     : " + numberOfUpgraders + ' of ' + spawn.memory.minUpgraders);
      console.log(spawnName + ": Repairers     : " + numberOfRepairers + ' of ' + spawn.memory.minRepairers);
      console.log(spawnName + ": WallRepairers : " + numberOfWallRepairers + ' of ' + spawn.memory.minWallRepairers);
      console.log(spawnName + ": Miners        : " + numberOfMiners + ' of ' + spawn.memory.minMiners);
      console.log(spawnName + ": Lorries       : " + numberOfLorries + ' of ' + spawn.memory.minLorries);
      console.log(spawnName + ": Diggers       : " + numberOfDiggers+ ' of ' + spawn.memory.minDiggers);
      console.log(spawnName + ": Truckers      : " + numberOfTruckers+ ' of ' + spawn.memory.minTrucks);
      console.log(spawnName + ": GrimReapers   : " + numberOfGrimReapers + ' of ' + spawn.memory.minGrimReapers);
      console.log(spawnName + ": LDH_W7N3      : " + numberOfLongDistanceHarvestersW7N3 + ' of ' + spawn.memory.minLDH_W7N3);
    }
  }
};


/*
Trucker158269

*/
