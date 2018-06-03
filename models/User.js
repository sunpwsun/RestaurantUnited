const mongoose = require('mongoose');
const { Schema } = mongoose;    // == const Schema = mongoose.Schema;


const userSchema = new Schema({
    from : String,      // Local, Google, Facebook
    userid : String,
    email : String,
    name : String,          // displayName
    //username : String,
    password : String
});

mongoose.model('users', userSchema);