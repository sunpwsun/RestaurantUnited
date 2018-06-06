const passport = require('passport')
const mongoose = require('mongoose')

const User     = mongoose.model('users')

module.exports = (app) => {

  

    // Google Auth
    app.get(
        '/auth/google',
        passport.authenticate( 'google', {
            scope: ['profile', 'email']
        })
    )

    app.get(
        '/auth/google/callback',
        passport.authenticate( 'google', {
            successRedirect: '/welcome',
            failureRedirect: '/failed'  /// 여기 수정
        })  
    )



    /// Facebook Auth




    // passport-local
    app.post( 
        '/auth/login',
        passport.authenticate('local', {
            successRedirect: '/welcome', 
            failureRedirect: '/',  /// 여기 수정
            failureFlash: false         /// 무슨 뜻? -- true일 경우, 사용자가 로그인에 실패시 메시지를 보여준다.
            })
        )


    /////////////////////////
    /// http://jeong-pro.tistory.com/67
 /*   
    app.get(
        '/signup',
        (req, res) => {
            res.render('signup')
        })
*/
    app.post(
        '/signup',
        (req, res, next) => {

            User.findOne( {userid:req.body.userid}, (err, user) => {
                if(err)
                    return next(err)
                if(user) {
                    req.flash( 'error', 'Already exists')
                    return res.redirect( '/signup')
                }

                // create new user
                new User( {
                    userid   : req.body.userid,
                    password : req.body.password,
                    from     : 'Local',
                    email    : req.body.userid,
                    name     : req.body.displayName,
                }).save(next(res))
                
            } )
/*
        }, passport.authenticate( 'local', {        /// 바로 로그인 시킴
            successRedirect: '/auth/login', 
            failureRedirect: '/signup',
            failureFlash: true
        })
        */
        }, (res) => {
         console.log( 'AA:')
            res.redirect('/auth/login')
        }
    )    
    ///////////////////////





    
}