const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn} = require('../lib/auth.js');

router.get('/signup', (request, response)=> {
    response.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureFlash: '/signup',
    failureFlash: true
}));

router.get('/signin', (request,response) => {
    response.render('auth/signin');
});

router.post('/signin', (request, response,next ) => {
    passport.authenticate('local.signin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(request, response, next);
});

router.get('/profile', isLoggedIn, (request, response) => {
    response.render('profile');
});

router.get('/logout', (request, response)=> {
    request.logOut();
    response.redirect('/signin');
});

module.exports = router;