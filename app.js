//1. Our express server does not parse the request automatically to json
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require('./config/keys.js');

//we are registering user model and post model in app.js
//we are not storing it in a constant as we are not exporting it
require('./models/user');
require('./models/post');

//this express.json() is also a middleware
app.use(express.json());
//registering the auth.js router 
app.use(require('./routes/auth'));
//registering the post.js router 
app.use(require('./routes/post'));
//registering the user.js router
app.use(require('./routes/user'));

/* MongoDB Atlas Connection begin */
mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    console.log("Successfully connected to mongoDB Atlas");
});

mongoose.connection.on('error', (err) => {
    console.log("Error connecting to mongoDB Atlas ", err);
});
/* MongoDB Atlas Connection end*/

//Code for production side
if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(PORT, () => {
    console.log("Server is listening at port 5000");
});