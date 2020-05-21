 require('dotenv').config();
 const express = require('express');
 const bodyParser = require('body-parser');
 const ejs = require("ejs") 
 const mongoose = require('mongoose');
 const encrypt = require('mongoose-encryption');
 const md5 = require('md5');

 const app = express();


 app.use(express.static("public"));
 app.set("view engine", 'ejs');
 app.use(bodyParser.urlencoded({
     extended: true
 }));

 // connect to Database
 mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

 //user schema
 const userSchema = new mongoose.Schema({
    email: String,
    password: String
 });

 userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password'] });

 const User = new mongoose.model("User", userSchema);

 app.get("/", function(req, res){
     res.render("home");
 });

 app.get("/login", function(req, res){
    res.render("login");
 });

 app.get("/register", function(req, res){
    
    res.render("register");
 });

 //register route
 app.post("/register", (req, res) => {
     const newUser = new User({
         email: req.body.username,
         password: md5(req.body.password)
     });
     newUser.save((err) =>{
         if(err) alert(err);
     })
     res.redirect("/login");
 })

 //login route
 app.post("/login", (req, res) => {
     const username = req.body.username;
     const password = md5(req.body.password);

     User.findOne({email: username}, (err, foundUser) => {
         if(err){
             alert(err);
         }
         if(foundUser) {
             if(foundUser.password === password){
                 res.render("secrets")
             }
         }
     })
 })


 app.listen(8842, (req, res) => {
    console.log("server is listening at port 8842");
    
 })