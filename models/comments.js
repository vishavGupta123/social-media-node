const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ],
},
{
    timestamps:true
});

const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;