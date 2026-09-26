require('dotenv').config();

const express = require('express');
const cors = require('cors');

const uploadRoute = require('./routes/upload.js');
const filesRoute = require('./routes/files.js');
const deleteRoute = require('./routes/delete.js');
const authRoutes = require('./routes/authRoutes.js');

const connectDB = require('./config/db.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use(uploadRoute)
app.use(filesRoute)
app.use(deleteRoute)
app.use('/api/auth', authRoutes);

connectDB();

const PORT = process.env.PORT || 5500

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`)
});