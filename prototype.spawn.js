module.exports = function () {
  // CUSTOMCREEP
  StructureSpawn.prototype.spawnCustomCreep =
    function (energy, roleName, name) {
      // create WORK, CARRY, MOVE = 200 creeps
      var numberOfParts = Math.floor(energy / 200);
      var body = [];
      for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
      }
      return this.spawnCreep(body, name, { memory: {role: roleName, working: false}});
    };

  // MINER
  StructureSpawn.prototype.spawnMiner =
    function (roleName, name, minerSource, minerContainer) {
      var body = [];
      for (let i = 0; i < 5; i++) {
        body.push(WORK);
      }
      body.push(MOVE);
      return this.spawnCreep(body, name, {memory: {role: roleName, 
                                                   working: false, 
                                                   sourceId: minerSource, 
                                                   containerId: minerContainer}});
    };

  // LORRY
  StructureSpawn.prototype.spawnLorry =
    function (energy, roleName, name, targetContainer) {
      // Lorry contains only CARRY and MOVE
      var numberOfParts = Math.floor(energy / 100);
      if (numberOfParts > 8) {
        numberOfParts = 8;
      }
      var body = [];
      for (let i=0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i=0; i < numberOfParts; i++) {
        body.push(MOVE);
      }
      return this.spawnCreep(body, name, {memory: {role: roleName, 
                                                   working: false, 
                                                   containerId: targetContainer}});
    };

  // TRUCKER
  StructureSpawn.prototype.spawnTrucker =
    function (energy, roleName, name, diggerId) {
      // Trucker contains only CARRY and MOVE
      var numberOfParts = Math.floor(energy / 100);
      if (numberOfParts > 10) {
        numberOfParts = 10;
      }
      var body = [];
      for (let i=0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i=0; i < numberOfParts; i++) {
        body.push(MOVE);
      }
      return this.spawnCreep(body, name, {memory: {role: roleName, 
                                                   working: false, 
                                                   diggerId: diggerId}});
    };

  // GRIMREAPER
  StructureSpawn.prototype.spawnGrimReaper =
    function (roleName, name) {
      var numberOfParts = 8;
      var body = [];
      for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
      }
      return this.spawnCreep(body, name, { memory: {role: roleName, 
                                                    working: false}});
    };

  // UPGRADER
  StructureSpawn.prototype.spawnUpgrader =
    function (energy, roleName, name) {
      // create WORK, CARRY, MOVE = 200 creeps
      var numberOfParts = Math.floor((energy - 50) / 250);
      var body = [];
      for (let i = 0; i < 2 * numberOfParts; i++) {
        body.push(WORK);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      body.push(MOVE);
      return this.spawnCreep(body, name, { memory: {role: roleName, 
                                                    working: false}});
    };

  // LONGDISTANCEHARVESTER
  StructureSpawn.prototype.spawnLongDistanceHarvester =
    function (energy, roleName, name, numberOfWorkParts, home, target, sourceIndex) {
      // 200 = WORK + CARRY +  MOVE + MOVE
      var numberOfParts = Math.floor(energy / 250);
      var body = [];
      for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < 2 * numberOfParts; i++) {
        body.push(MOVE);
      }
      return this.spawnCreep(body, name, { memory: {role: roleName, 
                                                    working: false,
                                                    homeRoom: home,
                                                    targetRoom: target,
                                                    sourceId: sourceIndex}});
    }

};
