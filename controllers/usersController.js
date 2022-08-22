const mongoose = require('mongoose');
const usersModel = require('../models/usersModel')
const bcrypt = require('bcryptjs');
const passport = require('passport');


const get_register = (req, res) => {
    res.render("register")
}

const get_login = (req, res) => {
    res.render('login');
}

const post_register = (req, res) => {
    let { fullname, username, password, confirmPassword } = req.body;

    let errors = [];

    //check if empty
    if (!username || !password || !confirmPassword) {
        errors.push({ message: "Please fill in all fields!" });
    }

    //check if passwords match
    if (password !== confirmPassword) {
        errors.push({ message: "Passwords do not match!" });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            ...req.body
        })
    } else {
        //check for duplicate username
        const preventDuplicateUsername = async () => {
            const findUser = await usersModel.findOne({ username: username });
            const foundUser = await findUser;

            if (foundUser !== null) {
                errors.push({ message: "The username you requested is taken!" })
                res.render('register', { errors, ...req.body })
            } else {
                const addUser = async () => {
                    try {
                        const resolve = new usersModel({
                            name: fullname, username, password
                        })
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(req.body.password, salt, function (err, hash) {
                                if (err) {
                                    res.send(err);
                                }
                                resolve.password = hash;

                                const data = resolve.save();

                                if (data) {
                                    req.flash('success_msg', 'Registered User!');
                                    res.render('login')
                                }
                            });
                        });
                    }
                    catch (e) {
                        res.send(e);
                    }
                }
                addUser();
            }
        }
        preventDuplicateUsername();
    }
}

const post_login = (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: './dashboard',
        failureRedirect: './login',
        failureFlash: true
    })(req,res,next)
}

const get_dashboard = (req,res) => {
    console.log(req.user);
    res.render('dashboard', {
        user: req.user
    });
}

const get_logout = (req,res) => {
    req.logout((err)=>{
        if(err){
            res.send(err)
        }

        req.flash('success_msg', "You've logged out");
        res.redirect('/users/login');
    });
    
}

module.exports = {
    get_register,
    get_login,
    post_register,
    post_login,
    get_dashboard,
    get_logout
}