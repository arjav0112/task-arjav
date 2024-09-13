require('dotenv').config()
const express = require('express')
const app = express()
const passport = require('passport')
const authroutes = require('./routes/youtube.js') 
const session = require('express-session')
const mongoose = require('mongoose');
const User = require('./models/User.js')
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

require('./startegies/google.js')
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
app.get("/",(req,res)=>{
    console.log(req.session)
    console.log(req.session.id)
    req.session.visited = true;
    res.status(201).send({msg: "hello peter"})
    
})
app.listen(port,()=>{
    console.log("app working at",port);
    
})