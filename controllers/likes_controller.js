const Like = require('../models/like');
const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports.toggleLike = async function(req,res){
    try{

        //likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');

        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        let existingLike = await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        })
        //if a like already exist delete it else make a new like
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }else{
            let newLike = await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        console.log("Hi i am here");
        return res.status(200).json({
            message:"Request Successfull!",
            data:{
                deleted:deleted
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}