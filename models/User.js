const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose');
const { Schema } = mongoose;    // == const Schema = mongoose.Schema;


const userSchema = new Schema({
    from : String,      // Local, Google, Facebook
    userid : { type: String, required: true, unique: true },        // Local : email,  Google & FB : id
    email : { type: String, required: true, unique: true },
    name : String,          // displayName
    //username : String,
    password : String,
    regionID : Number
});




/// http://jeong-pro.tistory.com/67

    // for bcrypt
    const noop = function() {}

    // run before save
    // encrypt the password
    userSchema.pre('save', function(done) {
        const user = this
        if( !user.isModified('password')) {
            return done()
        }

        const SALT_FACTOR = 10
        bcrypt.genSalt( SALT_FACTOR, function(err, salt) {
            if(err)
                return done(err)
            bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
                if(err)
                    return done(err)
                user.password = hashedPassword

                done();
            })
        })
    })


    // check password
    userSchema.methods.checkPassword = function(guess, done) {
        bcrypt.compare(guess, this.password, function(err, isMatch) {
            done(err, isMatch)
        })
    }


///////////

mongoose.model('users', userSchema);