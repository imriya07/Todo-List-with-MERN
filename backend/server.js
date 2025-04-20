const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  
const auth = require('./routes/auth');
const tasks = require('./routes/tasks');


app.use('/api/auth', auth);
app.use('/api/tasks',tasks)

const PORT = process.env.PORT || 8000;
app.listen(PORT,() =>{
  console.log(`server running ${PORT}`);
})
module.exports = app;