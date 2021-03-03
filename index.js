const express = require('express');
const env = require('./config/environment');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const cors = require('cors');

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');


app.use(sassMiddleware({
    src:path.join(__dirname,env.asset_path,'/scss'),
    dest:path.join(__dirname,env.asset_path,'css'),
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}))
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.asset_path));
//make the uploads part available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(expressLayouts);



app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store the session cookie in the db


app.use(cors());
app.use(session({
    name:'codeial',
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:'native'
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


app.use('/',require('./routes'));



app.listen(port,function(err){
    if(err){console.log('Error in running the server'); return;}
    console.log(`server is running successfully on port ${port}`);
})