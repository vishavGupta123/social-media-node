const nodemailer = require('../config/nodemailer');
const nodeMailer = require('../config/nodemailer');


exports.newComment = (comment)=>{
    console.log('inside new comment mailer');
    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from:"vishavgupta6023@gmail.com",
        to:comment.user.email,
        subject:"new comment published",
        html:htmlString
    },(err, info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }

        console.log('Message sent',info);
        return;
    })
}

exports.forgetPasswordLink = (user,accessToken)=>{
    nodemailer.transporter.sendMail({
        from:"vishavgupta6023@gmail.com",
        to:user.email,
        subject:"Reset password",
        html:'<p>Click <a href="http://localhost:8000/users/reset-password/?accessToken=' + accessToken+'">here</a>To reset your password </p>'
    },
    (err,info)=>{
        if(err){
            console.log("Error in sending mail",err);
            return;
        }
        console.log('Message sent',info);
        return;
    }
    )
}