const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection test failed:', err);
  } else {
    console.log('Database connection test succeeded:', res.rows);
  }
});

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Enhanced error logging for POST /api/items
app.post('/api/items', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the incoming request body
    const { field1, field2, field3 } = req.body;
    const newItem = await pool.query(
      'INSERT INTO items (field1, field2, field3) VALUES ($1, $2, $3) RETURNING *',
      [field1, field2, field3]
    );
    console.log('Inserted item:', newItem.rows[0]); // Log the inserted item
    res.json(newItem.rows[0]);
  } catch (err) {
    console.error('Error in POST /api/items:', err); // Log the full error object
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});