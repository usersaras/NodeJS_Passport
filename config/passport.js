const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const User = require('../models/usersModel');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username'}, (username, password, done)=>{
            //Match User

            User.findOne({username: username})
                .then(user=>{
                    if(!user){
                        return done(null, false, {message: 'Username does not exist!'});
                    }

                    //Match Password
                    bcrypt.compare(password, user.password, (err, isMatch)=>{
                        if(err){
                            throw err;
                        }

                        if(isMatch){
                            return done(null, user)
                        } else{
                            return done(null, false, {message: "Password is incorrect!"})
                        }
                    })
                }).catch(e=> res.send(e))
        })
    )

    passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});
}