var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');

router.get('/register', function(req, res){
  res.sendFile(path.join(__dirname+'../../public/index.html'));
});
router.get('/dashboard', function(req, res){
  if(req.isAuthenticated() && req.user.email){
    res.sendFile(path.join(__dirname+'../../public/index.html'));
  }else{
    res.redirect('/');
  }
});
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
router.post('/login', passport.authenticate('local-login'), function(req, res){
  res.json({userdata: req.user});
});

module.exports = router;