const Post = require("../models/posts");
const fs = require('fs');
const Comment = require('../models/comments');
const Like = require("../models/like");

module.exports.create = async function(req,res){
    // Post.create({
    //     content:req.body.content,
    //     user:req.user._id
    // },async function(err,post){
    //     post = await post.populate('user','name').execPopulate();
    //     if(req.xhr){
    //         return res.status(200).json({
    //             data:{
    //                 post:post,
    //                 message:"Post created!"
    //             }
    //         })
    //     }
    //     if(err){console.log('Error in creating the post'); return;}
    //     return res.redirect('back');
    // })

    console.log(req.xhr + " line number 22");
    if(req.xhr){
        Post.uploadedPostImage(req,res,async function(err){
            if(err){
                return res.end("Error uploading file. ");
            }
            console.log(req.file);
           console.log(req.body);
          let post = await Post.create({
               content:req.body.content,
               user:req.user,
           });
           if(req.file){
               post.postImage = Post.uploadedPostPath+'/'+req.file.filename;
               post.save();
           }
           return res.status(200).json({
               data:{
                   post:post
               }
           })
        })
    }
   
    
   
}


module.exports.destroy = function(req,res){
    Post.findById(req.params.id,function(err,post){
        //.id means the converting the object id into string
        if(post.user == req.user.id){
            

            Like.deleteMany({likeable:post,onModel:'Post'},function(err){
                if(err){
                    return res.status(500).json({
                        message:'Internal server error!'
                    });
                }
            });
            Like.deleteMany({_id: {$in:post.comments}},function(err){
                if(err){
                    return res.status(500).json({
                        message:"Internal server error!"
                    });
                }
            });
            post.remove();
            Comment.deleteMany({post:req.params.id},function(err){
                if(req.xhr){
                    console.log("Hi i am here");
                    return res.status(200).json({
                        data:{
                            post_id:req.params.id,
                            message:'Post deleted'
                        }
                    })
                }
             res.redirect('back');
            })

           
        }else{
            return res.redirect('back');
        }
    })
}