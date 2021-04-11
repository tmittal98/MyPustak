//NodeJS API for Authentication
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { SENDGRID_API_KEY, EMAIL } = require('../config/keys');
const { JWT_SECRET } = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API_KEY
    }
}))

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
                            // const msg = {
                            //     to: user.email, // Change to your recipient
                            //     from: 'tusharmittal065@gmail.com', // Change to your verified sender
                            //     subject: 'Signup success',
                            //     text: 'Welcome to instagram',
                            //     html: require('../services/emailTemplate')({
                            //         emailFrom: 'tusharmittal065@gmail.com'
                            //     }),
                            // }
                            // sgMail.send(msg)
                            //     .then(() => {
                            //         console.log('Email sent')
                            //     })
                            //     .catch((error) => {
                            //         console.error(error)
                            //     })

                            transporter.sendMail({
                                to: user.email,
                                from: "tusharmittal065@gmail.com",
                                subject: "Welcome to Socially",
                                html: require('../emailTemplates/welcomeTemplate')({
                                    name: user.name
                                })
                            });

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

router.post('/reset-password', (req, res) => {

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex");

        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User does not exists with this email" });
                }

                user.resetToken = token;
                user.expireToken = Date.now() + 3600000;

                user.save().then((result) => {

                    transporter.sendMail({
                        to: user.email,
                        from: "tusharmittal065@gmail.com",
                        subject: "password-reset",
                        html: `<p>You requested for password reset</p>
                                <h4>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset your password</h5>`
                    })

                    res.status(200).json({ message: "Check your email" });
                })
            })
    })
})

router.post('/new-password', (req, res) => {

    const newPassword = req.body.password;
    const sentToken = req.body.token;

    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" });
            }

            bcrypt.hash(newPassword, 12).then(hashedpassword => {

                user.password = hashedpassword;
                user.resetToken = undefined;
                user.expireToken = undefined;

                user.save().then((savedUser) => {
                    res.json({ message: "password updated successfully" });
                })
            })
        }).catch(err => {
            return res.status(422).json({ error: err });
        });
})
module.exports = router


