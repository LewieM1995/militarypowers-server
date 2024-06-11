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
    country.units.navy * 1.3 * modifiers.navy +
    country.units.airForce * 1.4 * modifiers.airForce +
    country.units.technology * 1.2 * modifiers.technology +
    country.units.logistics * 1.1 * modifiers.logistics +
    country.units.intelligence * 1.2 * modifiers.intelligence
  );
};

const calculateTotalPower = (country) => {
  return (
    country.units.infantry +
    country.units.navy +
    country.units.airForce +
    country.units.technology +
    country.units.logistics +
    country.units.intelligence
  );
};


const calculateRemainingUnits = (units, unitsLost) => {
  const remainingUnits = {};
  for (const unit in units) {
    if (units.hasOwnProperty(unit)) {
      remainingUnits[unit] = Math.max(0, units[unit] - (unitsLost[unit] || 0));
    }
  }
  return remainingUnits;
};
// Function to simulate a war between two countries
const simulateWar = (countryOne, countryTwo, terrain) => {
  console.log("Country One", countryOne.units);
  console.log("Country Two", countryTwo.units);

  const countryOneTotalPower = calculateTotalPower(countryOne);
  const countryTwoTotalPower = calculateTotalPower(countryTwo);

  const powerDifference = countryOneTotalPower - countryTwoTotalPower;

  if (
    Math.abs(powerDifference) <
    0.05 * Math.max(countryOneTotalPower, countryTwoTotalPower)
  ) {
    return {
      winner: "Stalemate",
      loser: "Stalemate",
      terrain,
      countryOnePower: countryOneTotalPower,
      countryTwoPower: countryTwoTotalPower,
      countryOneDamage: null,
      countryTwoDamage: null,
      countryOneUnitsLost: null,
      countryTwoUnitsLost: null,
      countryOneRemainingUnits: null,
      countryTwoRemainingUnits: null,
    };
  }

  // Check for division by zero
  const maxPower = Math.max(countryOneTotalPower, countryTwoTotalPower);
  const damagePercentage =
    maxPower !== 0 ? Math.abs(powerDifference) / maxPower : 0;

  // Calculate military power using the units calculated
  const countryOnePower = calculateMilitaryPower(countryOne, terrain);
  const countryTwoPower = calculateMilitaryPower(countryTwo, terrain);

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

  // Translate damage to units lost for both countries
  const countryOneUnitsLost = countryTwoDamage;
  const countryTwoUnitsLost = countryOneDamage;

  // Calculate remaining units for both countries after the war
  const countryOneRemainingUnits = calculateRemainingUnits(countryOne.units, countryOneUnitsLost);
  const countryTwoRemainingUnits = calculateRemainingUnits(countryTwo.units, countryTwoUnitsLost);

  // Simple war outcome logic
  const winner = powerDifference > 0 ? "Country 1" : "Country 2";
  const loser = winner === "Country 1" ? "Country 2" : "Country 1";

  return {
    winner,
    loser,
    terrain,
    countryOnePower,
    countryTwoPower,
    countryOneDamage,
    countryTwoDamage,
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

