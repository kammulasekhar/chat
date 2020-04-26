var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport, md5, db){
    passport.serializeUser(function(user, done) {
        done(null, user.email);
    });
    passport.deserializeUser(function(username, done) {
        db.query("SELECT * FROM register WHERE email = '"+username+"'", function(err, rows){
            done(err, rows[0]);
        });
    });
    passport.use('local-login', new LocalStrategy({
            usernameField : 'useremail',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            db.query("SELECT * FROM register WHERE email = '"+username+"'", function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, 'No user found.');
                }
                if (md5(password) !== rows[0].password){
                    return done(null, false, 'Oops! Wrong password.');
                }
                return done(null, rows[0]);
            });
        })
    );
}