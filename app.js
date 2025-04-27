const express = require('express');
const dotenv=require('dotenv').config();
const contactsRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose=require("mongoose");
const errorHandler = require('./middleware/errorHandler');
let connectDB = require('./config/mongoConn'); 

connectDB();
const app = express();
app.use(express.json());

app.use('/api/contacts',contactsRoutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

  