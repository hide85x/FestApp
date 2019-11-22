const config = require('../config/auth');

const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local')
const User = require('../model/user');
const bcrypt = require('bcrypt')

module.exports = (passport) => {



    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        (username, password, done) => {
            User.findOne({ email: username })
                .then(user => {
                    console.log(user)
                    if (!user) {
                        console.log("nie ma usera")
                        return done(null, false)
                    }
                    if (!bcrypt.compare(password, user.password)) {
                        // console.log(`${password} password`)
                        // console.log(`${user.password} user.password`)
                        return done(null, false)
                    }
                    console.log("local passport passed!")
                    return done(null, user)
                })
                .catch(err => console.log)
        }
    ))


    passport.serializeUser((user, done) => {
        //zapisuje nam usera w cookie
        done(null, user);
    });

    passport.deserializeUser((id, done) => { //odczytuje wysłąnegio przez browser usera z cookie
        User.findById(id).then(user => done(null, user))

    });



    passport.use(new FacebookStrategy({
        clientID: config.facebookAuth.clientId,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: "http://localhost:5000/auth/facebook/callback",
        profileFields: ['displayName', 'email']
    },
        function (accessToken, refreshToken, profile, done) {
            console.log(`profile: ${profile}`)
            const newUser = {
                facebookId: profile.id,
                name: profile.displayName,
                email: profile.email
            }
            console.log(newUser)
            User.findOne(
                { facebookId: profile.id })
                // { useFindandModify: true})
                .then(user => {
                    if (user) {
                        console.log('weve got one that goes by the name ', newUser.name)
                        return done(null, user) // metoda done wysyła nam dane do metody serializeUser powyzej 
                    }
                    new User(newUser)
                        .save()
                        .then(user => done(null, user))
                        .catch(err => next(err))

                })
                .catch(err => console.log(err))

        }

    ))

}