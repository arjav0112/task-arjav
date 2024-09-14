require('dotenv').config()
const express = require('express')
const app = express()
const passport = require('passport')
const authroutes = require('./routes/authroutes.js') 
const session = require('express-session')
const mongoose = require('mongoose');
const User = require('./models/user.js')
const path =require('path')
const ejsmate = require("ejs-mate")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsmate);

main().then(()=>{console.log("connection spotted")}).catch(err => console.log(err));

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

require('./startegies/ytpassport.js')
require('./startegies/gitpassport.js')
const port = process.env.PORT

const sessionOptions = {
    
    secret : "Mysecreatcode",
    resave : false,
    saveUninitialized : true,
    cookie: {
      expires : Date.now() + 7*24*60*60*1000,
      maxAge : 7*24*60*60*1000,
      httpOnly : true,
    },
  }
  
  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

app.use('/auth',authroutes)

app.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
      res.send("some error occured")
        throw err;

    }
    
    res.redirect("/");
});
})
app.get("/",(req,res)=>{
    
    res.render("home.ejs")
    
})

app.get("*",(req,res)=>{
  res.send("<h1>Page Not found Error</h1>")
})
app.listen(port,()=>{
    console.log("app working at",port);
    
})