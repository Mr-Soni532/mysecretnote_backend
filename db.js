const mongoose = require('mongoose');
require("dotenv").config()
const mongoURI = process.env.mongoURI;

// connectToMongo take two parameters ( mongoURI and a callback function)
const connectTOMongo = () => {
    mongoose.connect(mongoURI, ()=>{
        console.log('Connected Successfully')
    })
}
module.exports = connectTOMongo;