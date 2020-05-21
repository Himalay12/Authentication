 require('dotenv').config();
 const express = require('express');
 const bodyParser = require('body-parser');
 const ejs = require("ejs") 
 const mongoose = require('mongoose');
 //level 2 and 3
 //const encrypt = require('mongoose-encryption');
 //const md5 = require('md5');  
 // level 4
 //const bcrypt = require('bcrypt');
 //const saltRounds = 10;
 //level 5
 const session = require('express-session');
 const passport = require('passport');
 const passportLocalMongoose = require('passport-local-mongoose');

 const app = express();


 app.use(express.static("public"));
 app.set("view engine", 'ejs');
 app.use(bodyParser.urlencoded({
     extended: true
 }));

 //below all the uses function
 app.use(session({
     secret: "our little secret.",
     resave: false,
     saveUninitialized: false
 }));

 //initialize passport
 app.use(passport.initialize());
 app.use(passport.session());


 // connect to Database
 mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
 mongoose.set('useCreateIndex', true);

 //user schema
 const userSchema = new mongoose.Schema({
    email: String,
    password: String
 });

 //userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password'] });
 userSchema.plugin(passportLocalMongoose);
 
 const User = new mongoose.model("User", userSchema);

 //create strategy
 passport.use(User.createStrategy());
 
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 
 app.get("/", function(req, res){
     res.render("home");
 });

 app.get("/login", function(req, res){
    res.render("login");
 });

 app.get("/register", function(req, res){
    
    res.render("register");
 });

 app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()) res.render("secrets");
    else res.redirect("/login");
 });

 app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
 }); 

 //register route
 app.post("/register", (req, res) => {

    User.register({ username: req.body.username}, req.body.password, (err, user) => {
        if (err) console.log(err);
        else res.redirect("/login");
        res.redirect("/register");
    })

    //  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //      // Store hash in your password DB.
    //      if(err) alert(err);
         
    //      const newUser = new User({
    //          email: req.body.username,
    //          password: hash
    //      });
    //      newUser.save((err) =>{
    //          if(err) console.log(err);
    //      });
    //  });
     
    //  res.redirect("/login");
 })

 //login route
 app.post("/login", (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, err => {
        if(err) {
            console.log(err);
        }
        else passport.authenticate("local")(req, res, () => {
            res.redirect("/secrets");
        })
    });

    //  const username = req.body.username;
    //  const password = req.body.password;

    //  User.findOne({email: username}, (err, foundUser) => {
    //      if(err){
    //          alert(err);
    //      }
    //      if(foundUser) {
    //         bcrypt.compare(password, foundUser.password, function(err, result) {
    //             if(result) res.render("secrets");
    //             console.log("Not Found");
    //         });
    //      }
    //  })
 });


 app.listen(8842, (req, res) => {
    console.log("server is listening at port 8842");
    
 })