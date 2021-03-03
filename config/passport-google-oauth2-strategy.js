const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const env = require('./environment');

const User = require('../models/user');

passport.use(new googleStrategy({
    clientID:env.google_client_id,
    clientSecret:env.google_client_secret,
    callbackURL:env.google_call_back_url,
},
    function(accessToken,refreshToken,profile,done){
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            console.log(err);
            if(err){console.log("Error in google strategy-passport",err); return;}

            console.log(profile);

            if(user){
                return done(null,user);
            }
            else{
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                    friendships:[],
                },function(err,user){
            if(err){console.log("Error in google strategy-passport",err); return;}
            return done(null,user);
                })
            }
        })
    }

));

module.exports = passport;