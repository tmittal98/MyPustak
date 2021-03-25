//NodeJS API for Authentication
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected', requireLogin, (req, res) => {
    res.send('Hello keep secret ')
})

router.post('/signup', (req, res) => {
    //es6 destructuring
    const { name, email, password, pic } = req.body;
    //checking validation
    if (!email || !name || !password) {
        //422 response code means server has understand the request but it cannot process that
        //sending response codes also is a good practice
        return res.status(422).json({ error: "please add all the fields" })
    }
    // res.json({message:"succussfully posted"})
    //quering our database

    User.findOne({ email: email })
        .then((savedUser) => {
            //if user already exists
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" });
            }
            //the bigger the no is the more secure the password is
            //default value is 10
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    });
                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })

        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                res.status(422).json({ error: "Invalid email or password" })
            }
            //compare the password
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({message:"successfully signed in"})
                        //this will create a token
                        const { _id, name, email, following, followers, pic } = savedUser;
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        res.json({
                            token, user: {
                                _id,
                                name,
                                email,
                                followers,
                                following,
                                pic
                            }
                        })
                    }
                    else {
                        //let it be invalid email and password because hacker can get hint that atleast email is correct
                        return res.status(422).json({ error: "Invalid email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = router
