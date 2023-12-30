const dbConfig = require('./dbConfig');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create a connection to the MySQL database
const db = mysql.createConnection(dbConfig);
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.post('/altercar', (req, res) => {
  const { action, plate_id } = req.body;

  if (!action || !plate_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const checkQuery = 'SELECT * FROM Car WHERE Plate_id = ?';
  db.query(checkQuery, [plate_id], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Data not found in the database' });
    }

    if (action === 'enter') {
      const insertQuery = 'INSERT INTO servicelog (plate_id) VALUES (?)';
      db.query(insertQuery, [plate_id], (err) => {
        if (err) {
          console.error('Error inserting into the database:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      });

      const updateStatusQuery = 'UPDATE car SET Status = ? WHERE Plate_id = ?';
      const newStatus = 'Out-Of-Service';
      db.query(updateStatusQuery, [newStatus, plate_id], (err) => {
        if (err) {
          console.error('Error updating car status:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      });
    } else if (action === 'exit') {
      const updateCarQuery = 'UPDATE car SET Status = ? WHERE Plate_id = ?';
      const newStatus = 'active';
      db.query(updateCarQuery, [newStatus, plate_id], (err) => {
        if (err) {
          console.error('Error updating car status:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      });

      const updateStatusQuery = 'UPDATE servicelog SET end_date = ? WHERE Plate_id = ?';
      const currentDate = new Date();
      db.query(updateStatusQuery, [currentDate, plate_id], (err) => {
        if (err) {
          console.error('Error updating car status:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
