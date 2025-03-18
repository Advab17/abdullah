const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL connection string
const connectionString = 'postgresql://user:password@hostname:5432/gameshop_noik';

// Set up the PostgreSQL connection pool using the connection string
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false, // Disable certificate validation (necessary for cloud databases like Render)
    }
});

// POST route to insert a new user
app.post('/messages', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
            [name, email, message]
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
