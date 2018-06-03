const passport = require('passport')


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



    // Gacebook Auth




    // passport-local
    app.post( 
        '/auth/login',
        passport.authenticate('local', {
            successRedirect: '/welcome', 
            failureRedirect: '/',  /// 여기 수정
            failureFlash: false         /// 무슨 뜻? -- true일 경우, 사용자가 로그인에 실패시 메시지를 보여준다.
            })
        )
}