var express = require('express');
var router = express.Router();
const { check, body } = require('express-validator')

const userController = require('../controllers/user');


router.post('/register', [
    body('email')
        .isEmail()
        .withMessage("enter a valid email!")
        .trim()
        .normalizeEmail(),
    body('password')
        .isAlphanumeric()
        .isLength({ min: 4 })
        .trim()
],
    userController.registerUser)

router.get('/login', userController.getLogin);

// router.post('/login', [
//     body('email')
//         .isEmail()
//         .withMessage("enter a valid email!")
//         .trim()
//         .normalizeEmail(),
//     body('password')
//         .isAlphanumeric()
//         .isLength({ min: 4 })
//         .trim()
// ],
//  userController.postLogin
// )

router.get('/logout', userController.postLogOut)



module.exports = router