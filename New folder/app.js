const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL connection string
const connectionString = 'postgresql://root:cV2m43BQuIpK23w1ohu79PdXZo1P7EVl@dpg-cv9a5bl2ng1s73d2492g-a.oregon-postgres.render.com/abdullah_e3jb';

// Set up the PostgreSQL connection pool using the connection string
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false, // Disable certificate validation (necessary for cloud databases like Render)
    }
});

// POST route to insert a new user
app.post('/contacts', async (req, res) => {
    const { name, email, phonenumber, message } = req.body;

    if (!name || !email || !message ||!phonenumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO contacts (name, email, phonenumber, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email,phonenumber, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(`Error:`, err.message || err);
        res.status(500).json({ message: 'Error inserting data', error: err.message || err });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
