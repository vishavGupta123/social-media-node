const Comment = require('../models/comments');
const Post = require('../models/posts');
const commentsMailer = require('../mailers/comments_mailer');
const Like = require('../models/like');

module.exports.create = async function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            }, async function(err,comment){
                post.comments.push(comment);
                post.save();
                comment = await comment.populate('user','name email').execPopulate();
                commentsMailer.newComment(comment);
                if(req.xhr){
                   
                    return res.status(200).json({
                        data:{
                            comment:comment,
                            message:'Comment created successfully'
                   }
                    })
                }
             res.redirect('/');
            });
        }
    })

}

module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}