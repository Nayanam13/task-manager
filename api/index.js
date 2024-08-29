const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const cors = require('cors');
const authRoutes = require('../src/routes/auth');
const taskRoutes = require('../src/routes/tasks')

dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
// app.use('/',(req,res)=>{
//     res.send("Welcome to Task Manager")
// })
app.use('/auth', authRoutes);
app.use('/task',taskRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
