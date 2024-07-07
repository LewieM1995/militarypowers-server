const pool = require('../../database');

const warRoom = async (req, res) => {
  const playerLevel = parseInt(req.body.playerLevel);

  if (isNaN(playerLevel)) {
    return res.status(400).json({ error: "Invalid player level" });
  }

  const minLevel = playerLevel - 3;
  const maxLevel = playerLevel + 10;

  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM EnemyProfiles
      WHERE level BETWEEN ? AND ?
      ORDER BY level ASC;
    `;

    const [rows] = await connection.query(query, [minLevel, maxLevel]);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching enemy profiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { warRoom };
