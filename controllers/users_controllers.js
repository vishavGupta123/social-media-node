const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const ResetPasswordToken = require('../models/reset_password_token');
const { forgetPasswordLink } = require("../mailers/comments_mailer");
const crypto = require('crypto');
const Friendship = require("../models/friendship");

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('sign_up',{
        title:"Codeial | signup"
    });
};

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('sign_in',{
        title:"Codeial | Sign In"
    })
}

module.exports.forgetPassword = function(req,res){
    return res.render('forget_password',{
        title:"Forget Password"
    })
}


module.exports.create = function(req,res){
    console.log(req.body);
    if(req.body.password!=req.body.confirmPassword){
        req.flash('error','Password and confirm password did not match');
        return res.redirect('back');
    }
    User.create({
        email:req.body.email,
        name:req.body.name,
        password:req.body.password
    },function(err,user){
        if(err){console.log('Error in creating the user'); return;}
        else{
            console.log(user);
            return res.redirect('/users/sign-in');
        }
    })
};

module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/?page_num=1');
}

module.exports.profile = function(req,res){

    User.findById(req.params.id).exec(function(err,user){
        let areFriends = false;
        let userFriendshipArray = user.friendships;
        let signedInUserFriendshipArray = [];
        if(err){
            "Error in finding the user",err;
            return;
        }
        User.findById(req.user,function(err,signInUser){
            if(err){console.log("Error in finding the user "); return;}
            signedInUserFriendshipArray = signInUser.friendships;
            console.log(userFriendshipArray);
            console.log(signedInUserFriendshipArray);
            areFriends = signedInUserFriendshipArray.some(friendshipId => userFriendshipArray.includes(friendshipId));
            return res.render('user_profile_page',{
                title:'Profile_page',
                profile_user:user,
                are_friends:areFriends
            })
        })
        
    });
    // User.findById(req.params.id,function(err,user){
    //     if(err){console.log('Error in finding the user'); return;}
    //     return res.render('user_profile_page',{
    //         title:'Profile page',
    //         profile_user:user
    //     })
    // });
}

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id,{name:req.body.name,email:req.body.email},function(err,user){
    //         return res.redirect('back');
    //     })
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('Multer error'); return;}
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        console.log(user.avatar);
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error',"Error updating the user");
            return res.redirect('back');
        }
    }else{
        return res.status(401).send('Unauthorized');
    }
}


module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success',"You have logged out");
    return res.redirect("/");
}

module.exports.sendResetPasswordEmail = async function(req,res){

    try{
         console.log("Hi i am here");
         console.log(req.body);
         const user = await User.findOne({email:req.body.email});
         req.flash('success',"Email sent to your email id");
         if(user){

          const resetPasswordLink = await ResetPasswordToken.create({
               user:user._id,
               accessToken:crypto.randomBytes(20).toString('hex'),
               isValid:true
            });

            if(resetPasswordLink){
                forgetPasswordLink(user,resetPasswordLink.accessToken);
            }
         }
         console.log(user);
         return res.redirect('back');
    }catch(err){
        console.log(err);
    }
}

module.exports.resetPasswordPage = async function(req,res){
    console.log(req.query);
    let resetPasswordToken = await ResetPasswordToken.findOne({accessToken:req.query.accessToken});
    return res.render('reset_password',{
        title:"Reset Password",
        reset_password_token:resetPasswordToken
    });
}

module.exports.resetPassword = async function(req,res){
    try{
        console.log(req.body);
        console.log(req.query);
        let resetPasswordToken = await ResetPasswordToken.findOne({accessToken:req.query.accessToken});
        if(resetPasswordToken){
            let user = await User.findById(resetPasswordToken.user);
            if(req.body.password == req.body.confirm_password){
            user.password = req.body.password;
            resetPasswordToken.isValid = false;
            resetPasswordToken.save();
            console.log(resetPasswordToken);
            user.save();
            console.log(user);
            return res.redirect('/users/sign-in');
            }
            else if(req.body.password !== req.body.confirm_password){
                req.flash('error','password and confirm password did not match');
                resetPasswordToken.isValid = false;
                resetPasswordToken.save();
                return res.redirect('back');
            }
            
        }}catch(err){
        console.log(err);
    }
}


module.exports.addFriend = async function(req,res){
    try{
        console.log(req.params);
        let friendship = await Friendship.create({
            from_user:req.user._id,
            to_user:req.params.id,
            has_accepted:false
        });
        let fromUser = await User.findById(req.user._id);
        let toUser = await User.findById(req.params.id);
        fromUser.friendships.push(friendship);
        toUser.friendships.push(friendship);
        fromUser.save();
        toUser.save();
        console.log(fromUser);
        console.log(toUser);
        return res.redirect('back');
    }catch(err){
        console.log(err);
    }
    
}

module.exports.removeFriends = async function(req,res){
    try{
        console.log(req.params.friendshipId);
        let friendship = await Friendship.findById(req.params.friendshipId);
        let fromUser = await User.findById(friendship.from_user);
        let toUser = await User.findById(friendship.to_user);
        console.log(fromUser);
        console.log(toUser);
        await User.findByIdAndUpdate(fromUser._id,{$pull:{friendships:req.params.friendshipId}});
        await User.findByIdAndUpdate(toUser._id,{$pull:{friendships:req.params.friendshipId}});
        friendship.remove();
        console.log(fromUser);
        console.log(toUser);
        return res.redirect('back');
    }catch(err){
        console.log(err);
    }
}
