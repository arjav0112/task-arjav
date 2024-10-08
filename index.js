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
const Idcollection = require('./models/gitidcollection.js')
const Ytidcollection = require("./models/ytidcollection.js")
const GitUser = require("./models/gituser.js")
const MongoStore = require('connect-mongo')

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsmate);



const dburl = process.env.DB_URL;

main().then(()=>{console.log("connection spotted")}).catch(err => console.log(err));

async function main(){
  await mongoose.connect(dburl);
}

require('./startegies/ytpassport.js')
require('./startegies/gitpassport.js')
const port = process.env.PORT

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: 'Mysecreatcode',
  },
  touchAfter: 24*3600,
})


store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
  store:store,
  secret : "Mysecreatcode",
  resave : false,
  saveUninitialized : true,
}
  
  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

app.use('/auth',authroutes)

app.get("/logout",async (req,res)=>{
  await Idcollection.deleteMany({});
  await Ytidcollection.deleteMany({});
  await GitUser.deleteMany({});
  await User.deleteMany({});
  req.logout(async (err)=>{
    if(err){
      res.send("some error occured")
        throw err;

    }
})

res.redirect("/");
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