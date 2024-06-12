const terrains = ["desert", "forest", "mountain", "plains", "urban", "sea"];
const getRandomTerrain = () => {
  return terrains[Math.floor(Math.random() * terrains.length)];
};

const unitCostRating = {
  infantry: 100,
  navy: 600, 
  airForce: 1000, 
  technology: 1000, 
  logistics: 500, 
  intelligence: 500, 
};

// Function to calculate the military power of a country
const calculateMilitaryPower = (country, terrain) => {
  const terrainModifiers = {
    desert: {
      infantry: 1.0,
      navy: 0.7,
      airForce: 1.1,
      technology: 1.5,
      logistics: 0.9,
      intelligence: 1.0,
    },
    forest: {
      infantry: 1.1,
      navy: 0.8,
      airForce: 1.0,
      technology: 1.5,
      logistics: 0.9,
      intelligence: 1.0,
    },
    mountain: {
      infantry: 1.6,
      navy: 0.6,
      airForce: 1.4,
      technology: 1.5,
      logistics: 0.8,
      intelligence: 1.1,
    },
    plains: {
      infantry: 1.2,
      navy: 0.9,
      airForce: 1.1,
      technology: 1.5,
      logistics: 1.0,
      intelligence: 1.0,
    },
    urban: {
      infantry: 1.0,
      navy: 0.7,
      airForce: 1.0,
      technology: 1.5,
      logistics: 1.4,
      intelligence: 1.7,
    },
    sea: {
      infantry: 0.8,
      navy: 1.5,
      airForce: 1.2,
      technology: 1.5,
      logistics: 1.0,
      intelligence: 2,
    },
  };

  const modifiers = terrainModifiers[terrain];

  return (
    country.units.infantry * 1.5 * modifiers.infantry +
    country.units.navy * 1.5 * modifiers.navy +
    country.units.airForce * 1.5 * modifiers.airForce +
    country.units.technology * 1.5 * modifiers.technology +
    country.units.logistics * 1.5 * modifiers.logistics +
    country.units.intelligence * 1.5 * modifiers.intelligence
  );
};


const calculateRemainingUnits = (units, unitsLost, powerCoefficient) => {
  const remainingUnits = {};
  for (const unit in units) {
    if (units.hasOwnProperty(unit)) {
      remainingUnits[unit] = Math.floor(Math.max(0, units[unit] - unitsLost[unit]) * (1 - Math.abs(powerCoefficient)));
    }
  }
  return remainingUnits;
};

 const calculateUnitsLost = (initialUnits, remainingUnits) => {
  const unitsLost = {};
  for (const unit in initialUnits) {
    if (initialUnits.hasOwnProperty(unit)) {
      unitsLost[unit] = initialUnits[unit] - remainingUnits[unit];
    }
  }
  return unitsLost;
};

const stalemateLossRate = 0.05;
const applyStalemateLossRate= (units) => {
  const lossUnits = {};
  for (const unit in units){
    if (units.hasOwnProperty(unit)){
      lossUnits[unit] = Math.floor(units[unit] * stalemateLossRate)
    }
  }
  return lossUnits;
}

// Function to simulate a war between two countries
const simulateWar = (countryOne, countryTwo, terrain) => {

  let countryOneUnitsLost;
  let countryTwoUnitsLost;
  
  const countryOneTotalPower = calculateMilitaryPower(countryOne, terrain);
  const countryTwoTotalPower = calculateMilitaryPower(countryTwo, terrain);
  
  const powerDifference = countryOneTotalPower - countryTwoTotalPower;
  const totalPower = countryOneTotalPower + countryTwoTotalPower;
  const powerCoefficient = powerDifference / totalPower;

  
   

  // Check for division by zero
  const maxPower = Math.max(countryOneTotalPower, countryTwoTotalPower);
  const damagePercentage = maxPower !== 0 ? Math.abs(powerCoefficient) / maxPower : 0;

  // Calculate damage inflicted on each country's units
  const countryOneDamage = {
    infantry: Math.floor(countryOne.units.infantry * damagePercentage),
    navy: Math.floor(countryOne.units.navy * damagePercentage),
    airForce: Math.floor(countryOne.units.airForce * damagePercentage),
    technology: Math.floor(countryOne.units.technology * damagePercentage),
    logistics: Math.floor(countryOne.units.logistics * damagePercentage),
    intelligence: Math.floor(countryOne.units.intelligence * damagePercentage),
  };

  const countryTwoDamage = {
    infantry: Math.floor(countryTwo.units.infantry * damagePercentage),
    navy: Math.floor(countryTwo.units.navy * damagePercentage),
    airForce: Math.floor(countryTwo.units.airForce * damagePercentage),
    technology: Math.floor(countryTwo.units.technology * damagePercentage),
    logistics: Math.floor(countryTwo.units.logistics * damagePercentage),
    intelligence: Math.floor(countryTwo.units.intelligence * damagePercentage),
  };

  // Calculate remaining units for both countries after the war
  const countryOneRemainingUnits = calculateRemainingUnits(countryOne.units, countryTwoDamage, powerCoefficient);
  const countryTwoRemainingUnits = calculateRemainingUnits(countryTwo.units, countryOneDamage, powerCoefficient);
  
  countryOneUnitsLost = calculateUnitsLost(countryOne.units, countryOneRemainingUnits);
  countryTwoUnitsLost = calculateUnitsLost(countryTwo.units, countryTwoRemainingUnits);
  
  // Simple war outcome logic
  let winner = powerDifference > 0 ? "Country 1" : "Country 2";
  let loser = winner === "Country 1" ? "Country 2" : "Country 1";


  if (Math.abs(powerDifference) < 0.05 * Math.max(countryOneTotalPower, countryTwoTotalPower)) {
    countryOneUnitsLost = applyStalemateLossRate(countryOne.units);
    countryTwoUnitsLost = applyStalemateLossRate(countryTwo.units);
    winner = "Stalemate"
    loser ="Stalemate"
  }

   return {
      winner,
      loser,
      terrain,
      countryOneTotalPower,
      countryTwoTotalPower,
      countryOneUnitsLost,
      countryTwoUnitsLost,
      countryOneRemainingUnits,
      countryTwoRemainingUnits,
    };
 };

// Function to run the entire simulation
const runSimulation = (countryOneProfile, countryTwoProfile) => {
  console.log("Country One Profile", countryOneProfile);
  console.log("Country Two Profile", countryTwoProfile);

  const terrain = getRandomTerrain();
  console.log("Random Terrain:", terrain);

  const warResult = simulateWar(
    countryOneProfile,
    countryTwoProfile,
    terrain,

  );
  console.log("War Result:", warResult);
};

module.exports = {
  calculateMilitaryPower,
  simulateWar,
  runSimulation,
};

