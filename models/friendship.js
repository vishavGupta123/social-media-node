const mongoose = require('mongoose');

const friendShipSchema = new mongoose.Schema({
    //the user who send this request
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //the user who accepted this request, the naming is just to understand, otherwise, the users won't see a difference
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    has_accepted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

const Friendship = mongoose.model('Friendship',friendShipSchema);
module.exports = Friendship;