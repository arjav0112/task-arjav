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
        let subcribers = jsondata.items;
        let arr = [] 
        for(let sub of subcribers){
            arr.push({name: sub.snippet.title,channelId: sub.snippet.channelId})
        }
        console.log(arr);

        // console.log(jsondata.items[0].snippet);
    res.send(arr);


    }catch(err){
        console.log(err);
        throw err;
    }
    
})

router.get("/youtube",(req,res)=>{
    
    res.send("hello youtube")
})

module.exports= router;