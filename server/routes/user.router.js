const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
  res.send(req.user);
});

// verifying the user is authenticated before getting photos
router.get('/photos', rejectUnauthenticated, (req, res) => {
  console.log('Request user:', req.user);
  const userId = req.user.id;

  const query = `
    SELECT id, image_url, bio, name
    FROM "posts"
    WHERE user_id = $1;
  `;

  pool.query(query, [userId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching user photos:', error);
      res.sendStatus(500);
    });
});

// Handles POST request with new user data
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
