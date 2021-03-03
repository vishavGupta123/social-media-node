const Post = require("../models/posts");
const User = require("../models/user");

module.exports.index = function(req,res){
    console.log(req.query);
    let pageNum = req.query.page_num;
    pageNum = parseInt(pageNum);
    const resultsPerPage = 5;
    // Post.find({},function(err,posts){
    //     if(err){console.log('Error in creating the post'); return;}
    //     return res.render('home',{
    //         title:'Codeial home',
    //         posts:posts
    //     })
    // });
    Post.find({}).sort('-createdAt').skip( pageNum > 0 ? ((pageNum-1)*resultsPerPage):0).limit(resultsPerPage)
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'likes user'
        }
    }).populate('likes').sort('-createdAt').exec(function(err,posts){
        let all_users;
        let totalPages;
        Post.count({},function(err,count){
            if(err){console.log("Internal server error "); return;}
            console.log(count);
            totalPages = Math.ceil(count/resultsPerPage);
            console.log(totalPages);
        let friends=[];
        if(req.user){
            console.log(req.user+" ***line number 23");
           User.findById(req.user._id).populate({
               path:'friendships',
               populate:{
                   path:'from_user to_user',
                   model:'User'
               }
           }).exec(function(err,user){
               if(err){console.log('error in finding the user'); return;}
               friends = user.friendships;
               User.find({},function(err,users){
                if(err){console.log('Error in the database'); return;}
                return res.render('home',{
                    title:'Codeial | Home',
                    posts: posts,
                    all_users:users,
                    all_friends:friends,
                    page_num:pageNum,
                    total_pages:totalPages
                })
            });
           })
            
        }else{
            User.find({},function(err,users){
                if(err){console.log("Error in the database"); return;}
                return res.render('home',{
                    title:'Codeial | Home',
                    posts:posts,
                    all_users:users,
                    page_num:pageNum,
                    total_pages:totalPages
                });
            })
        }
        })
        
        
        // if(err){console.log('Error in creating the post'); return;}
        
    });
}