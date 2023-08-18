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

router.get('/gallery', (req, res) => {
  const query = `
    SELECT posts.id, posts.image_url, posts.caption, "user".username, COUNT(likes.user_id)::integer as likes
    FROM "posts"
    JOIN "user" ON "posts".user_id = "user".id
    LEFT JOIN "likes" ON "posts".id = "likes".post_id
    GROUP BY posts.id, "user".username;
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

router.post('/gallery/:photoId/like', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const photoId = req.params.photoId;

  const checkQuery = `
    SELECT * FROM "likes"
    WHERE user_id = $1 AND post_id = $2;
  `;

  pool.query(checkQuery, [userId, photoId])
    .then((result) => {
      if (result.rows.length > 0) {
        res.status(400).send({ message: 'You have already liked this photo.' });
        throw new Error('User has already liked this photo.');
      } else {
        const insertQuery = `
          INSERT INTO "likes" (user_id, post_id)
          VALUES ($1, $2);
        `;

        return pool.query(insertQuery, [userId, photoId]);
      }
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      if (error.message !== 'User has already liked this photo.') {
        console.error('Error liking the photo:', error);
        res.sendStatus(500);
      }
    });
});

router.get('/gallery/:photoId/likes', (req, res) => {
  const photoId = req.params.photoId;

  const query = `
    SELECT COUNT(user_id) AS likes
    FROM "likes"
    WHERE post_id = $1;
  `;

  pool.query(query, [photoId])
    .then((result) => {
      res.send({ likes: result.rows[0].likes });
    })
    .catch((error) => {
      console.error('Error fetching likes for the photo:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
