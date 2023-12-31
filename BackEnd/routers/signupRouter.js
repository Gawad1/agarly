const express = require('express');
const router = express.Router();
const signupRouter = (db) =>
{
  router.post('/', (req, res) => {
        const { SSN, Fname, Lname, gender, email, password, confirmpassword, date } = req.body;
        if (!SSN || !Fname || !Lname || !gender || !email || !password || !confirmpassword ||!date) {
          return res.status(400).json({ message: 'All fields are required' });
        }
      
        // Validate password and confirm password
        if (password !== confirmpassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
        }
      
        // Insert user data into the database
        const insertQuery = 'INSERT INTO Customer (ssn, f_name, l_name, gender, email, pass, b_d) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [SSN, Fname, Lname, gender, email, password, date], (err, results) => {
          if (err) {
            console.error('Error inserting into the database:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
      
          console.log('User signed up successfully');
          res.json({ message: 'Sign-up successful' });
        });
});
  return router;
  
  }

      
module.exports = signupRouter;