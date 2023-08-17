const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const cloudinary = require('../cloudinaryConfig/cloudinaryConfig');
const multer = require('multer');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

const upload = multer({ dest: 'uploads/' });

router.post('/', rejectUnauthenticated, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded.");
        }
        
        const filePath = req.file.path;

        // Upload the image to Cloudinary
        console.log(cloudinary);
        const uploadResponse = await cloudinary.uploader.upload(filePath);

        // Store the URL (and other details) to PostgreSQL database
        const queryText = `
            INSERT INTO posts (image_url, name, bio, user_id) 
            VALUES ($1, $2, $3, $4)
        `;
        const userId = req.user.id;
        await pool.query(queryText, [uploadResponse.url, req.body.name, req.body.bio, userId]);
        
        res.sendStatus(201);
    } catch (error) {
        console.error('Error uploading image or storing data:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
