const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    pic: {
        type: String,
        default: "https://res.cloudinary.com/tushar-mittal1998/image/upload/v1616681095/profilePic_yyifzd.png"
    }
});

mongoose.model("User", userSchema);
//user is the name of the model
//we are not exporting the model
//because sometime we get error that we used the model in one place so we can't use in any other place

