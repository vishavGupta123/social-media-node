const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const POST_IMAGE_PATH = path.join('/uploads/posts/images');

const postSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ],
    postImage:{
        type:String
    }
},{
    timestamps:true
});

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'..',POST_IMAGE_PATH));
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now())
    }
});

postSchema.statics.uploadedPostImage = multer({storage:storage}).single('postImage');
postSchema.statics.uploadedPostPath = POST_IMAGE_PATH;

const Post = mongoose.model('Post',postSchema);

module.exports = Post;