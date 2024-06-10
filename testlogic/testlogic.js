// Define countries' military stats
const countryOneBudget = {
  infantry: 2000000,
  navy: 500000,
  airForce: 600000,
  technology: 300000,
  logistics: 200000,
  intelligence: 200000,
};

const countryTwoBudget = {
  infantry: 2000000,
  navy: 650000,
  airForce: 600000,
  technology: 300000,
  logistics: 200000,
  intelligence: 200000,
};

const terrains = ["desert", "forest", "mountain", "plains", "urban", "sea"];
const getRandomTerrain = () => {
  return terrains[Math.floor(Math.random() * terrains.length)];
};

const attackType = "air";

const unitCostRating = {
  infantry: 100, // Cost rating for infantry
  navy: 500, // Cost rating for navy
  airForce: 1000, // Cost rating for airForce
  technology: 1000, // Cost rating for technology
  logistics: 500, // Cost rating for logistics
  intelligence: 500, // Cost rating for intelligence
};

// Function to allocate budget to various military branches
const allocateBudget = (totalBudget) => {
  const budgetAllocationToUnits = {
    infantry: Math.floor(totalBudget / unitCostRating.infantry),
    navy: Math.floor(totalBudget / unitCostRating.navy),
    airForce: Math.floor(totalBudget / unitCostRating.airForce),
    technology: Math.floor(totalBudget / unitCostRating.technology),
    logistics: Math.floor(totalBudget / unitCostRating.logistics),
    intelligence: Math.floor(totalBudget / unitCostRating.intelligence),
  };
  return budgetAllocationToUnits;
};
// Function to calculate the number of units based on the budget spent
const calculateUnits = (budget, unitCostRating) => {
    const units = {};
    for (const unitType in budget) {
      units[unitType] = Math.floor(budget[unitType] / unitCostRating[unitType]);
    }
    return units;
  };

// Function to calculate the military power of a country
const calculateMilitaryPower = (country, terrain) => {
  const terrainModifiers = {
    desert: {
      infantry: 1.0,
      navy: 0.7,
      airForce: 1.1,
      technology: 1.1,
      logistics: 0.9,
      intelligence: 1.0,
    },
    forest: {
      infantry: 1.1,
      navy: 0.8,
      airForce: 1.0,
      technology: 1.1,
      logistics: 0.9,
      intelligence: 1.0,
    },
    mountain: {
      infantry: 1.6,
      navy: 0.6,
      airForce: 1.4,
      technology: 1.2,
      logistics: 0.8,
      intelligence: 1.1,
    },
    plains: {
      infantry: 1.2,
      navy: 0.9,
      airForce: 1.1,
      technology: 1.0,
      logistics: 1.0,
      intelligence: 1.0,
    },
    urban: {
      infantry: 1.0,
      navy: 0.7,
      airForce: 1.0,
      technology: 1.6,
      logistics: 1.4,
      intelligence: 1.7,
    },
    sea: {
      infantry: 0.8,
      navy: 1.5,
      airForce: 1.2,
      technology: 1.0,
      logistics: 1.0,
      intelligence: 2,
    },
  };

  const modifiers = terrainModifiers[terrain];

  return (
    country.infantry * 1.5 * modifiers.infantry +
    country.navy * 1.3 * modifiers.navy +
    country.airForce * 1.4 * modifiers.airForce +
    country.technology * 1.2 * modifiers.technology +
    country.logistics * 1.1 * modifiers.logistics +
    country.intelligence * 1.2 * modifiers.intelligence
  );
};

const calculateTotalPower = (country) => {
    return (
      country.infantry +
      country.navy +
      country.airForce +
      country.technology +
      country.logistics +
      country.intelligence
    );
  };

// Function to simulate a war between two countries
const simulateWar = (countryOneBudget, countryTwoBudget, terrain, attackType) => {

    const countryOne = calculateUnits(countryOneBudget, unitCostRating);
    const countryTwo = calculateUnits(countryTwoBudget, unitCostRating);

    console.log('Country One', countryOne)
    console.log('Country Two', countryTwo)

    const countryOneTotalPower = calculateTotalPower(countryOne);
    const countryTwoTotalPower = calculateTotalPower(countryTwo);

    const powerDifference = countryOneTotalPower - countryTwoTotalPower;

    if (Math.abs(powerDifference) < 0.05 * Math.max(countryOneTotalPower, countryTwoTotalPower)) {
        return {
          winner: "Stalemate",
          loser: "Stalemate",
          terrain,
          attackType,
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
    const damagePercentage = maxPower !== 0 ? Math.abs(powerDifference) / maxPower : 0;

    // Calculate military power using the units calculated
    const countryOnePower = calculateMilitaryPower(countryOne, terrain);
    const countryTwoPower = calculateMilitaryPower(countryTwo, terrain);

  // Calculate damage inflicted on each country's units
  const countryOneDamage = {
    infantry: Math.floor(countryOne.infantry * damagePercentage),
    navy: Math.floor(countryOne.navy * damagePercentage),
    airForce: Math.floor(countryOne.airForce * damagePercentage),
    technology: Math.floor(countryOne.technology * damagePercentage),
    logistics: Math.floor(countryOne.logistics * damagePercentage),
    intelligence: Math.floor(countryOne.intelligence * damagePercentage),
  };

  const countryTwoDamage = {
    infantry: Math.floor(countryTwo.infantry * damagePercentage),
    navy: Math.floor(countryTwo.navy * damagePercentage),
    airForce: Math.floor(countryTwo.airForce * damagePercentage),
    technology: Math.floor(countryTwo.technology * damagePercentage),
    logistics: Math.floor(countryTwo.logistics * damagePercentage),
    intelligence: Math.floor(countryTwo.intelligence * damagePercentage),
  };

  // Translate damage to units lost for both countries
  const countryOneUnitsLost = countryTwoDamage;
  const countryTwoUnitsLost = countryOneDamage;

  // Calculate remaining units for both countries after the war
  const countryOneRemainingUnits = {
    infantry: countryOne.infantry - countryOneUnitsLost.infantry,
    navy: countryOne.navy - countryOneUnitsLost.navy,
    airForce: countryOne.airForce - countryOneUnitsLost.airForce,
    technology: countryOne.technology - countryOneUnitsLost.technology,
    logistics: countryOne.logistics - countryOneUnitsLost.logistics,
    intelligence: countryOne.intelligence - countryOneUnitsLost.intelligence
  };
  
  const countryTwoRemainingUnits = {
    infantry: countryTwo.infantry - countryTwoUnitsLost.infantry,
    navy: countryTwo.navy - countryTwoUnitsLost.navy,
    airForce: countryTwo.airForce - countryTwoUnitsLost.airForce,
    technology: countryTwo.technology - countryTwoUnitsLost.technology,
    logistics: countryTwo.logistics - countryTwoUnitsLost.logistics,
    intelligence: countryTwo.intelligence - countryTwoUnitsLost.intelligence
  };

  // Simple war outcome logic
  const winner = powerDifference > 0 ? "Country 1" : "Country 2";
  const loser = winner === "Country 1" ? "Country 2" : "Country 1";

  return {
    winner,
    loser,
    terrain,
    attackType,
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
const runSimulation = (totalBudget) => {
  console.log('Allocated Budget', totalBudget);

  const terrain = getRandomTerrain();
  console.log("Random Terrain:", terrain);

  const warResult = simulateWar(countryOneBudget, countryTwoBudget, terrain, attackType);
  console.log("War Result:", warResult);
};

module.exports = {
  allocateBudget,
  calculateMilitaryPower,
  simulateWar,
  runSimulation,
};
