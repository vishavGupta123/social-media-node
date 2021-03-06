const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname,"../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path: logDirectory
})

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key:'secret',
    db:'social_media_node_database',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:"vishavgupta6023@gmail.com",
            pass:"Game@allday24/7"
        }
    },
    google_client_id:"1048787061973-340ck3cu278s7mflki0l97fms2cifq67.apps.googleusercontent.com",
    google_client_secret:"C4Q2bwiV2tJM24dgnivwUyI7",
    google_call_back_url:'http://localhost:8000/users/auth/google/callback',
    morgan:{
        mode:'dev',
        options:{stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:process.env.CODEIAL_GOOGLE_USERNAME,
            pass:process.env.CODEIAL_GOOGLE_PASSWORD
        }
    },
    google_client_id:process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret:process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url:process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    morgan:{
        mode:'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);