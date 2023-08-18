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

router.get('/gallery', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const query = `
  SELECT posts.id, posts.image_url, posts.caption, "user".username, COUNT(likes.user_id)::integer as likes,
  CASE WHEN user_likes.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS userHasLiked
  FROM "posts"
  JOIN "user" ON "posts".user_id = "user".id
  LEFT JOIN "likes" ON "posts".id = "likes".post_id
  LEFT JOIN "likes" AS user_likes ON "posts".id = user_likes.post_id AND user_likes.user_id = $1
  GROUP BY posts.id, "user".username, user_likes.user_id
  ORDER BY posts.timestamp DESC;
  `;

  pool.query(query, [userId])
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

router.get('/gallery/:photoId/likes', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const photoId = req.params.photoId;

  const query = `
      SELECT COUNT(user_id) AS userLikes 
      FROM "likes" 
      WHERE post_id = $1 AND user_id = $2;
  `;

  pool.query(query, [photoId, userId])
  .then((result) => {
    res.send({ likes: Number(result.rows[0].userLikes) });
  })
  .catch((error) => {
      console.error('Error fetching likes for the photo by the user:', error);
      res.sendStatus(500);
  });
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
          const deleteQuery = `
              DELETE FROM "likes"
              WHERE user_id = $1 AND post_id = $2;
          `;
          return pool.query(deleteQuery, [userId, photoId])
              .then(() => { return { status: 'unliked' } });
      } else {
          const insertQuery = `
              INSERT INTO "likes" (user_id, post_id)
              VALUES ($1, $2);
          `;
          return pool.query(insertQuery, [userId, photoId])
              .then(() => { return { status: 'liked' } });
      }
  })
  .then((response) => {
      res.send(response);
  })
  .catch((error) => {
      console.error('Error with the like/unlike action:', error);
      res.sendStatus(500);
  });
});

router.delete('/gallery/:photoId/like', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const photoId = req.params.photoId;

  const deleteQuery = `
    DELETE FROM "likes"
    WHERE user_id = $1 AND post_id = $2;
  `;

  pool.query(deleteQuery, [userId, photoId])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error unliking the photo:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
