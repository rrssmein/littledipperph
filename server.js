const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Added here

// Create the Express app
const app = express();
const port = 3000;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'authentication_db'
});

// Middleware to parse JSON bodies and handle CORS
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json());
app.use(express.json());

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, 'tab_pages')));

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to the MySQL database');
});

// POST route for user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err.message);
        return res.status(500).json({ error: `Database error: ${err.message}` });
      }
      res.status(200).json({ message: 'Registration successful!' });
    });
  } catch (err) {
    console.error('Error hashing password:', err.message);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

// POST route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Admin credentials
  if (email === 'admin@example.com' && password === 'adminpassword') {
    return res.json({ message: 'Admin login successful!', redirectUrl: '/index.html' });
  }

  // Database lookup for other users
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Account not found. Please register.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ message: 'Login successful!', redirectUrl: '/tab_pages/profile_user.html' });
    } else {
      res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }
  });
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// Server for Saving User details
app.post('/saveProfile', (req, res) => {
  const { name, location, age, gender } = req.body;
  const userId = req.session.userId; // Assuming user is logged in

  // Update the profile in the database
  const query = `
      UPDATE user_profiles
      SET full_name = ?, location = ?, age = ?, gender = ?
      WHERE user_id = ?
  `;
  db.query(query, [name, location, age, gender, userId], (err, result) => {
      if (err) {
          return res.status(500).send({ message: 'Database error' });
      }
      res.json({ message: 'Profile updated successfully' });
  });
});

