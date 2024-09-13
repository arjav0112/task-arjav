const express = require('express')
const router = express.Router();
const passport = require("passport")
router.get("/google",passport.authenticate("google"),async (req,res)=>{
    try{
        
        let {Token} = req.user;
        console.log(Token);
        let API_KEY = process.env.API_KEY;
        let data = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?key${API_KEY}&part=snippet&mine=true&access_token=${Token}`);
        let jsondata = await data.json();
        console.log(jsondata.items[0].snippet);
    res.send("hello world");


    }catch(err){
        console.log(err);
        throw err;
    }
    
})

router.get("/youtube",(req,res)=>{
    
    res.send("hello youtube")
})

module.exports= router;