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
    const { rows } = await pool.query(`
      SELECT 
        *,
        (column4 - (COALESCE(lead_time_weeks, 0) * INTERVAL '1 week'))::date as submit_by_date 
      FROM items
    `);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT category FROM categories');
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
    const { column1, column2, column3, column4, lead_time_weeks } = req.body;
    const newItem = await pool.query(
      'INSERT INTO items (column1, column2, column3, column4, lead_time_weeks) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [column1, column2, column3, column4, lead_time_weeks]
    );
    console.log('Inserted item:', newItem.rows[0]); // Log the inserted item
    res.json(newItem.rows[0]);
  } catch (err) {
    console.error('Error in POST /api/items:', err); // Log the full error object
    res.status(500).send('Server error');
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { column1, column2, column3, column4, lead_time_weeks } = req.body;
    const updatedItem = await pool.query(
      'UPDATE items SET column1 = $1, column2 = $2, column3 = $3, column4 = $4, lead_time_weeks = $5 WHERE id = $6 RETURNING *',
      [column1, column2, column3, column4, lead_time_weeks, id]
    );
    
    if (updatedItem.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(updatedItem.rows[0]);
  } catch (err) {
    console.error('Error in PUT /api/items/:id:', err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});