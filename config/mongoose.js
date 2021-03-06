const mongoose = require('mongoose');
const env = require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`,{useNewUrlParser:true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error',console.error.bind(console,"MongoDB connection error:"));

db.once('open',function(){
    console.log("Successfully connected to the database");
})


module.exports = db;