const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

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

app.get('/', (req, res) => {
    res.send("API is working!");
});

// GET ALL Data from "User" table in DB
app.get('/api/users/get', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM "User"`);
        console.log(result);
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

// To-Do: GET specific user's info

// POST (send) Data to "User" table in DB
app.post('/api/users/send', async (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }
    
    const { user_name, password, country_name } = req.body; // add queries
    let connection;

    try {
        connection = await oracledb.getConnection();

         // handles queries of type blob
        // const queriesBlob = queries ? Buffer.from(queries, 'base64') : null;

        const sql_insert = `INSERT INTO "User" (user_name, "password", country_name) VALUES (:user_name, :password, :country_name)`; // add queriesBlob

        await connection.execute(sql_insert, {
            user_name: user_name,
            password: password,
            // queries: queriesBlob,
            country_name: country_name
        });

        await connection.commit();

        res.status(201).send("User created successfully");

    } catch (err) {
        console.error("Error inserting data:", err.message);
        res.status(500).send("Error inserting data");
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