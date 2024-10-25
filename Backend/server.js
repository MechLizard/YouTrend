const express = require('express');
const oracledb = require('oracledb');
require('dotenv').config();

const app = express();
const PORT = 5000;

async function connectToDatabase() {
    try {
        await oracledb.createPool({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONNECTION_STRING,
        });
        console.log("Connected to Oracle Database!");
    } catch (err) {
        console.error("Failed to connect to database", err);
    }
}

// will modify according to queries, but placeholder for now
app.get('/api/data', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM your_table`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    connectToDatabase();
});