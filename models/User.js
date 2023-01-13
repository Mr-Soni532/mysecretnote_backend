const mongoose = require('mongoose');
const {Schema} = mongoose;

// Schema is a skeleton structor which represent logical view of entire database.
const UserSchema = new Schema({
    name:{
        type: String, 
        required: true
    }, 
    email:{
        type: String, 
        required: true,
        unique: true
    }, 
    password:{
        type: String, 
        required: true
    }, 
    date:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('user', UserSchema);
// User.createIndexes();
module.exports = User;