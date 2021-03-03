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
}

const production = {
    name: 'production'
}

module.exports = development;