const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const cloudinary = require('../cloudinaryConfig/cloudinaryConfig');
const multer = require('multer');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/', rejectUnauthenticated, upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;

        if (!filePath) {
            throw new Error('File path is missing.');
        }

        const uploadResponse = await cloudinary.uploader.upload(filePath);

        // delete the file after uploading
        fs.unlinkSync(filePath);

        const queryText = `
            INSERT INTO posts (image_url, caption, user_id) 
            VALUES ($1, $2, $3)
        `;
        const userId = req.user.id;
        await pool.query(queryText, [uploadResponse.url, req.body.caption, userId]);
        
        res.sendStatus(201);
    } catch (error) {
        console.error('Error uploading image or storing data:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
