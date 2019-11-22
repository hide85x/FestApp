const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../model/user')
const express= require('express');



// exports.postLogin= ('/login', passport.authenticate('local'), (req, res, next)=> {

// }
// )

exports.registerUser = (req, res, next) => {
    let { email, password, confirmPassword } = req.body;
    console.log(password, email, confirmPassword)

    // const errors= validationResult(req);
    const errors = [];
    function emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    if (emailIsValid(email) === false) {
        errors.push({ message: " Thats not even a real email!" })
    }
    if (password !== confirmPassword) {
        errors.push({ message: "Passwords has to be the same numnuts!" })
    }
    if (password.length < 5) {
        errors.push({ message: " Password is too short, make ure it is at least 5 chars " })
    }
    if (errors.length > 0) {
        console.log(errors)
        req.flash("error_msg", `${errors[0].message}`)
        return res.status(422).redirect('back')
    }
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log('hes here already!')
                req.flash("error_msg", "Hey hey hey, we have that guy in our data base already!")
                res.redirect('back')

            } else {
                bcrypt
                    .hash(password, 12)
                    .then(hashedPw => {
                        const user = new User({
                            email: email,
                            password: hashedPw

                        });
                        return user.save()
                    })
                    .then(result => {
                        console.log(result);
                        req.flash('success_msg', "You are registered! motherfucker!!!!");
                        res.redirect('/')
                    })
            }
        })

        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};




exports.getLogin = (req, res, next) => {
    res.render('index/login')
};


// exports.postLogin = (req, res, next) => {
//     const { email, password } = req.body;
//     const errors = validationResult(req);
//     User.findOne({ email: email })
//         .then(user => {
//             if (!user) {
//                 console.log('there isnt such a user!')
//                 console.log("from userFindOne method :  ", errors.array())
//                 const x = errors.array().map(e => e.msg)
//                 console.log(x)
//                 console.log(req.user)
//                 req.flash('error_msg', "there isnt such a user!")
//                 res.render('index/login', {
//                     errors: errors.array()
//                 })

//             } else {
//                 bcrypt
//                     .compare(password, user.password)
//                     .then(doMatch => {
//                         if (doMatch) {
//                             console.log('passwords match !')
//                             req.session.user = user;
//                             return req.session.save(err => {
//                                 // console.log(err);
//                                 res.redirect('/');
//                             });
//                         }
//                         return res.status(422).render('auth/login');
//                     })


//             }
//         })
//         .catch(err => {
//             console.log(err)
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             next(error);
//         })

// }

exports.postLogOut = (req, res, next) => {
   
    req.session.destroy(err => {
        req.logOut()
        console.log(err);
        console.log("about to destroy session")
        res.redirect('/')
    });
}