
const passport       = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy  = require('passport-local').Strategy
const mongoose       = require('mongoose')
const keys           = require('../config/keys')

const User = mongoose.model('users')

// 세션에 기록
passport.serializeUser((user, done) => {
    console.log('serialize - ' + user.id)
    done( null, user.id )
})

// 세션에서 읽기
passport.deserializeUser((id, done) => {

    console.log('deserialize - ' + id)
    User.findById(id)
        .then( user => {
            done(null, user)
        })
})


/// facebook 추가




passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {

            User.findOne( {from:'Google', userid: profile.id })
                .then( existingUser => {
console.log('B')
                    if( existingUser) {
                        // Already exists the user
                        console.log('C')
                        done(null, existingUser)
                    }
                    else {
                        // Doesn't exist the user,
                        // make the new record
                        new User( {from: 'Google', userid: profile.id, email: profile.email, name: profile.displayName} )
                            .save()
                            .then(user => done(null, user))
                            console.log('D')
                    }
                })
        }
    )
)

passport.use( 'local',
    new LocalStrategy(
        (username, password, done) => {
            User.findOne( {from: 'Local', userid:username}, function(err, user) {
                           
                if( err )
                    return done(err);
                if( !user )
                    return done( null, false, { message: 'Incorrect Username'} )    /// Incorrect Username or Password로 수정할 것
                //if( !user.validPassword(password) )
                /*
                if( user.password !== password)
                    return done( null, false, { message: 'Incorrect Password'} )    /// Incorrect Username or Password로 수정할 것
                */
                user.checkPassword(password, function(err,isMatch) {
                    if(err)
                        return done(err)
                    if(isMatch)
                        return done(null,user)
                    else   
                        return done(null,false, {message:'Incorrect Password'})
                })

            })

         
        }
    )
)