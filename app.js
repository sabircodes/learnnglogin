require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

//creating the app/server
const app = express();

//using body-parser
app.use(bodyparser.urlencoded({ extended: true }));

//setting the view engine
app.set('view engine', 'ejs');
//using the css and js
app.use(express.static("public"));

// applying encryption


///////new database connection is made here and arrays are not used anymore
mongoose.connect("mongodb://localhost:27017/userDB");
//creating a schema
const userschema = new mongoose.Schema({
    email:String,
    password:String

});

// console.log();
//secret is move to .env file
userschema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});



//mongoose model
const User = new mongoose.model("User",userschema); 


//mongoose 


//now creating a doc and inserting many option






app.get('/', (req, res) => {
    res.render('home');
});

app.get("/login", (req, res) => {
    res.render('login');
    
});

app.get("/register", (req, res) => {
    res.render('register');
    
});

app.post("/register", (req, res) => {
    const newuser = new User({
        email:req.body.username,
        password: req.body.password
    });

    newuser.save(function (err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });

});


app.post("/login", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ email : username},function(err ,founduser){
            if(err){
                console.log(err);

            }
            if(founduser){
                if(founduser.password===password){
                    res.render('secrets');
                }
            }

        });
});





app.listen(8080, function () {
    console.log("server is started on port 8080")
})