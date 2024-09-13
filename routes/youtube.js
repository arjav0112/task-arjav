const express = require('express')
const router = express.Router();
const passport = require("passport")
router.get("/google",passport.authenticate("google"),(req,res)=>{
    
    console.log(req.user)
    
    res.send("hello world");
})

router.get("/youtube",(req,res)=>{
    console.log(req.profile)
    console.log(req.params)
    console.log(req.body);
    console.log(req.session.id)
    res.send("hello youtube")
})

module.exports= router;