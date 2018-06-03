const express       = require('express')
const session       = require('express-session')
const passport      = require('passport')
const bodyParser    = require('body-parser')
const mongoose      = require('mongoose')
const keys          = require('./config/keys')

require('./models/User')
require('./models/Restaurant')
require('./services/passport')

const app = express()
app.use(session( {

    // http://html5around.com/wordpress/tutorials/node-js%EC%97%90%EC%84%9C-%EC%84%B8%EC%85%98sessioin-%EA%B4%80%EB%A6%AC-%EB%B0%A9%EB%B2%95/
// 저장을 redis에 하자. redis : 인메모리 DB, 가벼운 정보 저장하기 좋다.
//  store: new RedisStore(options),
// 또는 몽ㅇ고DB에 저장
    secret : keys.sessionSecret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 1000*60*5
    }
}))
app.use(passport.initialize())
app.use(passport.session())



// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());




mongoose.connect(keys.mongoURI)




// [CONFIGURE ROUTER]
const routerAPI = require('./routes/apiRoutes')(app)
const routerAuth = require('./routes/authRoutes')(app)

app.listen(process.env.PORT || 3300)