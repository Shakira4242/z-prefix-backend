const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/items', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT items.*, users.username FROM items JOIN users ON items.user_id = users.id ORDER BY items.id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT items.*, users.username FROM items JOIN users ON items.user_id = users.id WHERE items.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/inventory/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM items WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/items', async (req, res) => {
  try {
    const { userId, itemName, description, quantity } = req.body;
    const result = await pool.query(
      'INSERT INTO items (user_id, item_name, description, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, itemName, description, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, description, quantity } = req.body;
    const result = await pool.query(
      'UPDATE items SET item_name = $1, description = $2, quantity = $3 WHERE id = $4 RETURNING *',
      [itemName, description, quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
