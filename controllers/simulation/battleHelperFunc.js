 /* const terrains = ["desert", "forest", "mountain", "plains", "urban", "sea"];
const getRandomTerrain = () => {
  try {
    //console.log('getRandomTerrain called');
    return terrains[Math.floor(Math.random() * terrains.length)];
  } catch (error) {
    console.error('Error in getRandomTerrain:', error);
  }
}; */

const calculateMilitaryPower = (country, terrain) => {
  try {
    const terrainModifiers = {
      desert: {
        Riflemen: 1.0,
        Sniper: 1.0,
        Medic: 1.0,
        AntiTank: 1.0,
        MachineGunner: 1.0,
        Battleship: 0.7,
        Destroyer: 0.7,
        Submarine: 0.7,
        Frigate: 0.7,
        Cruiser: 0.7,
        FighterJet: 1.5,
        Drone: 1.5,
        AttackHelicopter: 1.5,
        Bomber: 1.5,
        SatelliteSystems: 1.5,
        Robotics: 1.5,
        Biotechnology: 1.5,
        Nanotechnology: 1.5,
        FieldHospital: 1.6,
        AerialSupplyDrop: 1.6,
        EngineeringCorp: 1.6,
        MedicalEvacVehicle: 1.6,
        HumanIntel: 1.2,
        CyberIntel: 1.2,
        DroneSurveillanceUnit: 1.2
      },
      forest: {
        Riflemen: 1.6,
        Sniper: 1.6,
        Medic: 1.6,
        AntiTank: 1.6,
        MachineGunner: 1.6,
        Battleship: 0.7,
        Destroyer: 0.7,
        Submarine: 0.7,
        Frigate: 0.7,
        Cruiser: 0.7,
        FighterJet: 1,
        Drone: 1,
        AttackHelicopter: 1,
        Bomber: 1,
        SatelliteSystems: 1.5,
        Robotics: 1.5,
        Biotechnology: 1.5,
        Nanotechnology: 1.5,
        FieldHospital: 1.1,
        AerialSupplyDrop: 1.1,
        EngineeringCorp: 1.1,
        MedicalEvacVehicle: 1.1,
        HumanIntel: 1.7,
        CyberIntel: 1.7,
        DroneSurveillanceUnit: 1.7
      },
      mountain: {
        Riflemen: 1.6,
        Sniper: 1.6,
        Medic: 1.6,
        AntiTank: 1.6,
        MachineGunner: 1.6,
        Battleship: 0.6,
        Destroyer: 0.6,
        Submarine: 0.6,
        Frigate: 0.6,
        Cruiser: 0.6,
        FighterJet: 1.4,
        Drone: 1.4,
        AttackHelicopter: 1.4,
        Bomber: 1.4,
        SatelliteSystems: 1.5,
        Robotics: 1.5,
        Biotechnology: 1.5,
        Nanotechnology: 1.5,
        FieldHospital: 1.2,
        AerialSupplyDrop: 1.2,
        EngineeringCorp: 1.2,
        MedicalEvacVehicle: 1.2,
        HumanIntel: 1.4,
        CyberIntel: 1.4,
        DroneSurveillanceUnit: 1.4
      },
      plains: {
        Riflemen: 1.2,
        Sniper: 1.2,
        Medic: 1.2,
        AntiTank: 1.2,
        MachineGunner: 1.2,
        Battleship: 0.9,
        Destroyer: 0.9,
        Submarine: 0.9,
        Frigate: 0.9,
        Cruiser: 0.9,
        FighterJet: 1.1,
        Drone: 1.1,
        AttackHelicopter: 1.1,
        Bomber: 1.1,
        SatelliteSystems: 1.5,
        Robotics: 1.5,
        Biotechnology: 1.5,
        Nanotechnology: 1.5,
        FieldHospital: 1.0,
        AerialSupplyDrop: 1.0,
        EngineeringCorp: 1.0,
        MedicalEvacVehicle: 1.0,
        HumanIntel: 1.0,
        CyberIntel: 1.0,
        DroneSurveillanceUnit: 1.0
      },
      urban: {
        Riflemen: 1.0,
        Sniper: 1.0,
        Medic: 1.0,
        AntiTank: 1.0,
        MachineGunner: 1.0,
        Battleship: 0.7,
        Destroyer: 0.7,
        Submarine: 0.7,
        Frigate: 0.7,
        Cruiser: 0.7,
        FighterJet: 1.0,
        Drone: 1.0,
        AttackHelicopter: 1.0,
        Bomber: 1.0,
        SatelliteSystems: 1.5,
        Robotics: 1.5,
        Biotechnology: 1.5,
        Nanotechnology: 1.5,
        FieldHospital: 1.4,
        AerialSupplyDrop: 1.4,
        EngineeringCorp: 1.4,
        MedicalEvacVehicle: 1.4,
        HumanIntel: 1.7,
        CyberIntel: 1.7,
        DroneSurveillanceUnit: 1.7
      },
      sea: {
        Riflemen: 0.8,
        Sniper: 0.8,
        Medic: 0.8,
        AntiTank: 0.8,
        MachineGunner: 0.8,
        Battleship: 1.9,
        Destroyer: 1.9,
        Submarine: 1.9,
        Frigate: 1.9,
        Cruiser: 1.9,
        FighterJet: 1.7,
        Drone: 1.7,
        AttackHelicopter: 1.7,
        Bomber: 1.7,
        SatelliteSystems: 1.5,
        Robotics: 1.5,
        Biotechnology: 1.5,
        Nanotechnology: 1.5,
        FieldHospital: 1.0,
        AerialSupplyDrop: 1.0,
        EngineeringCorp: 1.0,
        MedicalEvacVehicle: 1.0,
        HumanIntel: 2.0,
        CyberIntel: 2.0,
        DroneSurveillanceUnit: 2.0
      },
    };

    const modifiers = terrainModifiers[terrain];

    return (
      country.units.Riflemen * 0.5 * modifiers.Riflemen +
      country.units.Sniper * 0.6 * modifiers.Sniper +
      country.units.Medic * 0.7 * modifiers.Medic +
      country.units.AntiTank * 0.55 * modifiers.AntiTank +
      country.units.MachineGunner * 0.5 * modifiers.MachineGunner +
      country.units.Battleship * 1.2 * modifiers.Battleship +
      country.units.Destroyer * 1.2 * modifiers.Destroyer +
      country.units.Submarine * 1.2 * modifiers.Submarine +
      country.units.Frigate * 0.9 * modifiers.Frigate +
      country.units.Cruiser * 1 * modifiers.Cruiser +
      country.units.FighterJet * 1.2 * modifiers.FighterJet +
      country.units.Drone * 1.4 * modifiers.Drone +
      country.units.AttackHelicopter * 1.4 * modifiers.AttackHelicopter +
      country.units.Bomber * 1.6 * modifiers.Bomber +
      country.units.SatelliteSystems * 1.1 * modifiers.SatelliteSystems +
      country.units.Robotics * 1.7 * modifiers.Robotics +
      country.units.Biotechnology * 1.9 * modifiers.Biotechnology +
      country.units.Nanotechnology * 4 * modifiers.Nanotechnology +
      country.units.FieldHospital * 0.5 * modifiers.FieldHospital +
      country.units.AerialSupplyDrop * 0.5 * modifiers.AerialSupplyDrop +
      country.units.EngineeringCorp * 0.5 * modifiers.EngineeringCorp +
      country.units.MedicalEvacVehicle * 0.5 * modifiers.MedicalEvacVehicle +
      country.units.HumanIntel * 2 * modifiers.HumanIntel +
      country.units.CyberIntel * 2 * modifiers.CyberIntel +
      country.units.DroneSurveillanceUnit * 2 * modifiers.DroneSurveillanceUnit
    );
  } catch (error) {
    console.error('Error in calculateMilitaryPower:', error);
  }
};

const calculateRemainingUnits = (initialUnits, lossPercentage, isWinner, isStalemate = false) => {
  try {
    const remainingUnits = {};

    // Adjust lossFactor based on whether it's a stalemate or a win/loss scenario
    const lossFactor = isStalemate ? 0.95 : (isWinner ? 1 - lossPercentage / 10 : 1 - lossPercentage);
    
    for (const unit in initialUnits) {
      if (initialUnits.hasOwnProperty(unit)) {
        const initialCount = initialUnits[unit];

        if (isNaN(initialCount) || initialCount < 0) {
          console.warn(`Invalid initial unit count for ${unit}:`, initialCount);
          remainingUnits[unit] = 0; // Default to 0 if the initial unit count is invalid
        } else {
          const remainingCount = Math.floor(initialCount * lossFactor);
          if (isNaN(remainingCount) || remainingCount < 0) {
            console.warn(`Invalid remaining unit count for ${unit}:`, remainingCount);
            remainingUnits[unit] = 0; // Default to 0 if the remaining unit count is invalid
          } else {
            remainingUnits[unit] = remainingCount;
          }
        }
      }
    }
    return remainingUnits;
  } catch (error) {
    console.error('Error in calculateRemainingUnits:', error);
    return {
      Riflemen: 0,
      Sniper: 0,
      Medic: 0,
      AntiTank: 0,
      MachineGunner: 0,
      Battleship: 0,
      Destroyer: 0,
      Submarine: 0,
      Frigate: 0,
      Cruiser: 0,
      FighterJet: 0,
      Drone: 0,
      AttackHelicopter: 0,
      Bomber: 0,
      SatelliteSystems: 0,
      Robotics: 0,
      Biotechnology: 0,
      Nanotechnology: 0,
      FieldHospital: 0,
      AerialSupplyDrop: 0,
      EngineeringCorp: 0,
      MedicalEvacVehicle: 0,
      HumanIntel: 0,
      CyberIntel: 0,
      DroneSurveillanceUnit: 0
    };
  }
};

const calculateUnitsLost = (initialUnits, remainingUnits) => {
  try {
    //console.log('calculateUnitsLost called with initialUnits:', initialUnits, 'remainingUnits:', remainingUnits);
    const unitsLost = {};
    for (const unit in initialUnits) {
      if (initialUnits.hasOwnProperty(unit)) {
        unitsLost[unit] = initialUnits[unit] - remainingUnits[unit];
      }
    }
    return unitsLost;
  } catch (error) {
    console.error('Error in calculateUnitsLost:', error);
  }
};

const applyStalemateLossRate = (units) => {
  try {
    const stalemateLossRate = 0.05;
    const lossUnits = {};

    for (const unit in units) {
      if (units.hasOwnProperty(unit)) {
        const unitCount = units[unit];

        // Ensure the unit count is a valid number
        if (isNaN(unitCount) || unitCount < 0) {
          console.warn(`Invalid unit count for ${unit}:`, unitCount);
          lossUnits[unit] = 0; // Default to 0 if the unit count is invalid
        } else {
          lossUnits[unit] = Math.floor(unitCount * stalemateLossRate);
        }
      }
    }
    return lossUnits;
  } catch (error) {
    console.error('Error in applyStalemateLossRate:', error);
    return {
      Riflemen: 0,
      Sniper: 0,
      Medic: 0,
      AntiTank: 0,
      MachineGunner: 0,
      Battleship: 0,
      Destroyer: 0,
      Submarine: 0,
      Frigate: 0,
      Cruiser: 0,
      FighterJet: 0,
      Drone: 0,
      AttackHelicopter: 0,
      Bomber: 0,
      SatelliteSystems: 0,
      Robotics: 0,
      Biotechnology: 0,
      Nanotechnology: 0,
      FieldHospital: 0,
      AerialSupplyDrop: 0,
      EngineeringCorp: 0,
      MedicalEvacVehicle: 0,
      HumanIntel: 0,
      CyberIntel: 0,
      DroneSurveillanceUnit: 0
    };
  }
};

const calculateLossPercentage = (winnerPower, loserPower) => {
  try {
    //console.log('calculateLossPercentage called with winnerPower:', winnerPower, 'loserPower:', loserPower);
    const totalPower = winnerPower + loserPower;
    const powerDifference = winnerPower - loserPower;
    return Math.abs(powerDifference) / totalPower;
  } catch (error) {
    console.error('Error in calculateLossPercentage:', error);
  }
};

const rewardWinner = (level, isWinner, enemyLevel) => {
  try {
    //console.log('rewardWinner called with level:', level, 'isWinner:', isWinner, 'enemyLevel:', enemyLevel);
    let xpGain;
    if (isWinner) {
      if (level > enemyLevel) {
        xpGain = (level + enemyLevel) * 600;
        return xpGain;
      } else {
        xpGain = (level + enemyLevel) * 4 * 600;
        return xpGain;
      }
    }
    return 0;
  } catch (error) {
    console.error('Error in rewardWinner:', error);
  }
};

const calculateBudgetIncrease = (winnerLevel, enemyLevel, initValue) => {
  try {
    //console.log('calculateBudgetIncrease called with winnerLevel:', winnerLevel, 'enemyLevel:', enemyLevel, 'initValue:', initValue);
    let levelFactor;

    if (winnerLevel > enemyLevel) {
      levelFactor = (winnerLevel + enemyLevel) / 2; // Example calculation based on the winner's level
    } else {
      levelFactor = ((winnerLevel + enemyLevel) * 3.5) / 2; // Example calculation based on the winner's and enemy's levels
    }

    const budgetIncrease = initValue * levelFactor;
    return budgetIncrease;
  } catch (error) {
    console.error('Error in calculateBudgetIncrease:', error);
  }
};

const updateProfileBudget = (profile, budgetIncrease) => {
  try {
    //console.log('updateProfileBudget called with profile:', profile, 'budgetIncrease:', budgetIncrease);

    // Convert the budget to a number before performing arithmetic operations
    profile.budget = parseFloat(profile.budget) + budgetIncrease;

    // Ensure the budget is a string formatted to two decimal places
    profile.budget = profile.budget.toFixed(2);

    return profile;
  } catch (error) {
    console.error('Error in updateProfileBudget:', error);
  }
};

const updateProfileXpAndLevel = (profile, xpGain) => {
  try {
    //console.log('updateProfileXpAndLevel called with profile:', profile, 'xpGain:', xpGain);
    const { level, xp, nextLevelXp } = profile.profileStats;
    let updatedXp = xp + xpGain;
    let updatedLevel = level;
    let updatedNextLevelXp = nextLevelXp;

    while (updatedXp >= updatedNextLevelXp) {
      updatedXp -= updatedNextLevelXp;
      updatedLevel += 1;
      updatedNextLevelXp *= 1.1;
    }

    const updatedProfileStats = {
      ...profile.profileStats,
      level: updatedLevel,
      xp: updatedXp,
      nextLevelXp: updatedNextLevelXp,
    };

    return {
      ...profile,
      profileStats: updatedProfileStats,
    };
  } catch (error) {
    console.error('Error in updateProfileXpAndLevel:', error);
  }
};

const updateBattleStats = (winnerStats, isWinner) => {
  try {
    //console.log('updateBattleStats called with winnerStats:', winnerStats, 'isWinner:', isWinner);
    if (isWinner){
      return winnerStats + 1;
    }
    return winnerStats;
  } catch (error) {
    console.error('Error in updateBattleStats:', error);
  }
};

const updateTotalWins = (winnerStats, isWinner) => {
  try {
    //console.log('updateConsecutiveWins called with winnerStats:', winnerStats, 'isWinner:', isWinner);
    if (isWinner){
      return winnerStats + 1;
    } 
    return winnerStats;
  } catch (error) {
    console.error('Error in updateTotalWins:', error);
  }
};

const updateTotalLosses = (winnerStats, isWinner) => {
  try {
    if (!isWinner){
      return winnerStats + 1;
    } 
    return winnerStats;
  } catch (error) {
    console.error('Error in updateTotalLosses:', error);
  }
};

const updateHighestEnemyLevelDefeated = (winnerStats, enemyLevel, isWinner) => {
  try {
    //console.log('updateHighestEnemyLevelDefeated called with winnerStats:', winnerStats, 'enemyLevel:', enemyLevel, 'isWinner:', isWinner);
    if (isWinner){
      winnerStats = enemyLevel;
    }
    return winnerStats;
  } catch (error) {
    console.error('Error in updateHighestEnemyLevelDefeated:', error);
  }
};

const updateFirstwin= (winnerStats, isWinner) => {
  try {
    //console.log('updateFirstwin called with winnerStats:', winnerStats, 'isWinner:', isWinner);
    if (isWinner){
      winnerStats = true;
    }
    return winnerStats;
  } catch (error) {
    console.error('Error in updateFirstwin:', error);
  }
};

const checkAndAwardAchievements = (playerProfile, enemyLevel) => {
  try {
    //console.log('checkAndAwardAchievements called with playerProfile:', playerProfile, 'enemyLevel:', enemyLevel);
    if (!Array.isArray(playerProfile.profileStats.achievements)) {
      playerProfile.profileStats.achievements = [];
    }

    achievementCriteria.forEach((achievement) => {
      if (
        achievement.checkCriteria(playerProfile, enemyLevel) &&
        !playerProfile.profileStats.achievements.some((ach) => ach.id === achievement.id)
      ) {
        playerProfile.profileStats.achievements.push({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
        });
        //console.log(`${playerProfile.name} earned the "${achievement.name}" achievement!`);
      }
    });
  } catch (error) {
    console.error('Error in checkAndAwardAchievements:', error);
  }
};

const achievementCriteria = [
  {
    id: 1,
    name: 'First Victory',
    description: 'Win your first battle',
    checkCriteria: (profile) => profile.profileStats.firstVictory,
    icon: null
  },
  {
    id: 2,
    name: 'Unstoppable',
    description: 'Win 5 battles in a row',
    checkCriteria: (profile) => profile.profileStats.total_wins >= 5,
    icon: null
  },
  {
    id: 3,
    name: 'Master Strategist',
    description: 'Reach level 10',
    checkCriteria: (profile) => profile.profileStats.level >= 10,
    icon: null
  },
  {
    id: 4,
    name: 'Legendary Warrior',
    description: 'Defeat a level 10 opponent',
    checkCriteria: (profile, enemyLevel) => profile.profileStats.highestEnemyLevelDefeated >= 10,
    icon: null
  },
];

module.exports = {
  calculateMilitaryPower,
  calculateRemainingUnits,
  calculateUnitsLost,
  applyStalemateLossRate,
  calculateLossPercentage,
  rewardWinner,
  calculateBudgetIncrease,
  updateProfileBudget,
  updateProfileXpAndLevel,
  updateBattleStats,
  updateTotalWins,
  updateTotalLosses,
  updateHighestEnemyLevelDefeated,
  updateFirstwin,
  checkAndAwardAchievements
};
