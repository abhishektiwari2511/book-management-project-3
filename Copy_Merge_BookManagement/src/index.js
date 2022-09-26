//=====================Importing Module and Packages=====================//
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
//const moment = require('moment');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect("mongodb+srv://BittuMishra:ZsLbBdUnCK.2jta@cluster0.2v1vzde.mongodb.net/Project3group15Database?retryWrites=true&w=majority", {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is Connected."))
    .catch(error => console.log(error))

//===================== Global Middleware for All Route =====================//
app.use('/', route)

app.listen(process.env.PORT || 3000, function() {
    console.log('Express App Running on Port: ' + (process.env.PORT || 3000))
});