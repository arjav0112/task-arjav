const express = require('express')
const router = express.Router();
const passport = require("passport")
const axios = require("axios")
const GitUser = require("../models/gituser.js")
const User = require("../models/user.js")

router.get("/page",async (req,res)=>{
    // console.log(req.user)
    let id = "66e59901a6be6c7bd6e3a229"
    if(req.user){
         id = req.user["_id"]
    }
    
    let users = await User.findById(id);
    let gituser = await GitUser.findOne({name: "arjav0112"});
    res.render("mainpage.ejs",{users,gituser})

})

router.get("/google",passport.authenticate("google"),async (req,res)=>{
    try{
        
        let {Token} = req.user;
        let users = req.user;
        let byteId = "UC0lExKW4coiaK816lOg8A5g"
        
        // console.log(Token);
        let API_KEY = process.env.API_KEY;
        let data = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?key${API_KEY}&part=snippet&mine=true&access_token=${Token}`);
        let jsondata = await data.json();
        let subcribers = jsondata.items;
        let arr = [] 
        for(let sub of subcribers){
            arr.push({name: sub.snippet.title,channelId: sub.snippet.channelId})
        }
        let subcribed = {name : "arjav" , channelId : "abc"}
        subcribed = arr.find((ele) => (ele.channelId === byteId));
        // console.log(subcribed)
        if(subcribed.name === "BYTE"){
            let id = users["_id"];
            users = await User.findByIdAndUpdate(id,{isvalid: true},{new:true})
            // console.log(users)
            return res.redirect("/auth/page")
        }else{
            return res.redirect("/auth/page");
        }

    }catch(err){
        console.log(err);
        throw err;
    }
    
})

router.get("/github",passport.authenticate("github"),async (req,res)=>{
    try{
        let gituser = req.user
        
        let username = req.user.name;
        let TokenGit = req.user.TokenGit
        const data = await axios.get(`https://api.github.com/users/${username}/following/bytemait`, {
            headers: {              
                Authorization: `Bearer ${TokenGit}`
            }
        });
        // console.log(users);
        if(data.status === 204){
            let id = gituser["_id"]
            gituser = await GitUser.findByIdAndUpdate(id,{isvalid: true},{new:true});
            
            return res.redirect("/auth/page")
        }else{
            return res.status(200).redirect("/auth/page")
        }
        
    }catch(err){
        
        res.status(200).redirect("/auth/page")
    }
    
})



router.get("/end",async (req,res)=>{
    res.send("thank you for visting")
})

module.exports= router;