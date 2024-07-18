const pool = require('../../database');

const updateUnits = async (req, res) => {
  const { countryId, units, budget } = req.body;
  
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update units in the units table
      const [unitsResult] = await connection.query(
        `UPDATE units 
         SET Riflemen = ?, Sniper = ?, Medic = ?, AntiTank = ?, MachineGunner = ?, 
             Battleship = ?, Destroyer = ?, Submarine = ?, Frigate = ?, Cruiser = ?, 
             FighterJet = ?, Drone = ?, AttackHelicopter = ?, Bomber = ?, 
             SatelliteSystems = ?, Robotics = ?, Biotechnology = ?, Nanotechnology = ?, 
             FieldHospital = ?, AerialSupplyDrop = ?, EngineeringCorp = ?, MedicalEvacVehicle = ?, 
             HumanIntel = ?, CyberIntel = ?, DroneSurveillanceUnit = ? 
         WHERE country_id = ?`,
        [
          units.Riflemen, units.Sniper, units.Medic, units.AntiTank, units.MachineGunner,
          units.Battleship, units.Destroyer, units.Submarine, units.Frigate, units.Cruiser,
          units.FighterJet, units.Drone, units.AttackHelicopter, units.Bomber,
          units.SatelliteSystems, units.Robotics, units.Biotechnology, units.Nanotechnology,
          units.FieldHospital, units.AerialSupplyDrop, units.EngineeringCorp, units.MedicalEvacVehicle,
          units.HumanIntel, units.CyberIntel, units.DroneSurveillanceUnit,
          countryId,
        ]
      );

      // Update budget in the country table
      await connection.query(
        'UPDATE country SET budget = ? WHERE id = ?',
        [budget, countryId]
      );

      // Commit transaction
      await connection.commit();

      // Fetch the updated data
      const [updatedUserData] = await connection.query(
        `SELECT 
          u.Riflemen, u.Sniper, u.Medic, u.AntiTank, u.MachineGunner,
          u.Battleship, u.Destroyer, u.Submarine, u.Frigate, u.Cruiser,
          u.FighterJet, u.Drone, u.AttackHelicopter, u.Bomber,
          u.SatelliteSystems, u.Robotics, u.Biotechnology, u.Nanotechnology,
          u.FieldHospital, u.AerialSupplyDrop, u.EngineeringCorp, u.MedicalEvacVehicle,
          u.HumanIntel, u.CyberIntel, u.DroneSurveillanceUnit, 
          c.budget 
         FROM units u 
         JOIN country c ON u.country_id = c.id 
         WHERE u.country_id = ?`,
        [countryId]
      );

      res.json({ success: true, data: updatedUserData[0] });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Error during transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = updateUnits;
