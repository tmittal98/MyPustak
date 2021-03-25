//NodeJS API for creating posts
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

//this is easy route 
router.get('/allposts', requireLogin, (req, res) => {

    Post.find()
        .populate("postedBy", "_id name email")//to expand the object id so that we can get details
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({ posts })//we can condense it down to post 
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/getsubpost', requireLogin, (req, res) => {

    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name email")//to expand the object id so that we can get details
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({ posts })//we can condense it down to post 
        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/createpost', requireLogin, (req, res) => {

    const { title, body, pic } = req.body;
    // console.log()
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    // console.log(req.user)
    // res.send("OK")

    const post = new Post({
        // title:title is written as title as key and value pair both are same
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    //in the jwt authentication part we have put userData to req.user so from there we are getting 
    //information
    req.user.password = undefined
    //post.save() puts the data in the database
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err);
        })
});
//route to get posts created by a specific user
router.get('/myposts', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name email")
        .then(myPost => {
            res.json({ myPost })
        })
        .catch(err => {
            console.log(err)
        })
})
//route for like a post
router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,
        {
            $push: { likes: req.user._id },
        },
        {
            new: true
        }
    ).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        else {
            // console.log(result);
            return res.json(result);
        }
    });
});
//route for unlike a post
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,
        {
            $pull: { likes: req.user._id },

        },
        {
            new: true
        }
    ).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        else {
            return res.json(result);
        }
    });
});
//route for unlike a post
router.put('/comment', requireLogin, (req, res) => {

    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,
        {
            $push: { comments: comment },

        },
        {
            new: true
        }
    )
        .populate("comments.postedBy", "id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            else {
                return res.json(result);
            }
        });
});
//route for deleting a post
router.delete('/deletePost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
})


module.exports = router