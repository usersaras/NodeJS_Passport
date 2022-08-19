const mongoose = require('mongoose');
const usersModel = require('../models/usersModel')
const bcrypt = require('bcryptjs');

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
                                    res.redirect('/users/login')
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

module.exports = {
    get_register,
    get_login,
    post_register
}