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

// GET route for specific user's photos
router.get('/photos', rejectUnauthenticated, (req, res) => {
  console.log('Request user:', req.user);
  const userId = req.user.id;

  const query = `
    SELECT id, image_url, caption
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

// GET route for all photos for the gallery page
router.get('/gallery', (req, res) => {
  const query = `
    SELECT posts.id, posts.image_url, posts.caption, "user".username
    FROM "posts"
    JOIN "user" ON "posts".user_id = "user".id;
  `;

  pool.query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching all photos:', error);
      res.sendStatus(500);
    });
});

// DELETE route for photos
router.delete('/photos/:photoId', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const photoId = req.params.photoId;

  const query = `
    DELETE FROM "posts"
    WHERE id = $1 AND user_id = $2;
  `;

  pool.query(query, [photoId, userId])
    .then((result) => {
      if (result.rowCount === 0) {
        res.status(404).send({ message: 'Photo not found or not owned by user.' });
      } else {
        res.sendStatus(200);
      }
    })
    .catch((error) => {
      console.error('Error deleting user photo:', error);
      res.sendStatus(500);
    });
});

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

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

router.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
