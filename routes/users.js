const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/users_controllers');

router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.post('/update/:id',passport.checkAuthentication,userController.update);
router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);
router.post('/create',userController.create);
//use passport as a middleware to authenticate

router.post('/create-session',passport.authenticate('local',{failureRedirect:'/users/sign-in'},),userController.createSession)

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession);
router.get('/sign-out',userController.destroySession);
router.get('/forget-password',userController.forgetPassword);
router.post('/reset-password-email',userController.sendResetPasswordEmail);
router.get('/reset-password',userController.resetPasswordPage);
router.post('/reset-password',userController.resetPassword);
router.get('/add-friend/:id',userController.addFriend);
router.get('/remove-friend/:friendshipId',userController.removeFriends);
module.exports = router;