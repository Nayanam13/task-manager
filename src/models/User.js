const { Schema: _Schema, model } = require('mongoose');
const Schema = _Schema;

const userSchema = new Schema({
    googleId: { type: String, required: false, default: null},
    firstName: {type: String,default: null},
    lastName: {type: String,default: null},
    email: { type: String, unique: true, sparse: true },     // Email is unique if present
    password: { type: String },                              // Hashed password
});

module.exports =  model('User', userSchema);