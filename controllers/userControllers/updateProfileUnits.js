const pool = require('../../database');

const updateUnits = async (req, res) => {
  const { countryId, units, budget } = req.body;
  
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update units in the units table
      const [unitsResult] = await connection.query(
        'UPDATE units SET infantry = ?, navy = ?, airForce = ?, technology = ?, logistics = ?, intelligence = ? WHERE country_id = ?',
        [
          units.infantry,
          units.navy,
          units.airForce,
          units.technology,
          units.logistics,
          units.intelligence,
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
          u.infantry, u.navy, u.airForce, u.technology, u.logistics, u.intelligence, 
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
