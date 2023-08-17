require('dotenv').config();

const express = require('express');
const pool = require('./modules/pool'); 
const cloudinary = require('./cloudinaryConfig/cloudinaryConfig'); 

const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');

// Upload route
const uploadRouter = require('./routes/upload.router');

// Express middleware
app.use(express.json());

// Passport Session Configuration
app.use(sessionMiddleware);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/upload', uploadRouter);

// Serve static files
app.use(express.static('build'));

// App Set
const PORT = process.env.PORT || 8002;

// Listen
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
