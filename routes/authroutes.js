const express = require('express')
const router = express.Router();
const passport = require("passport")
const axios = require("axios")
const GitUser = require("../models/gituser.js")
const User = require("../models/user.js")
const Idcollection = require("../models/gitidcollection.js")
const Ytidcollection = require("../models/ytidcollection.js")



router.get("/page",async (req,res)=>{
    
    let id = "66e58b4b69e979f0b89bf83e"
    // console.log(Idcollection)
    let gitidcollector = await Idcollection.findOne({createdgit : 1});
    let ytidcollector = await Ytidcollection.findOne({createdyt : 1});
    // console.log(gitid); 
    let githubid = "66e59a4b69e979f0b89bf83e"
    if(gitidcollector){
        githubid = gitidcollector.gitid;
    }
    if(ytidcollector){
         id = ytidcollector.ytid;
    }
    // if(req.id){
    //     id = req.id;
    // }
    
    let users = await User.findById(id);
    let gituser = await GitUser.findById(githubid);
    res.render("mainpage.ejs",{users,gituser})

})

router.get("/google",passport.authenticate("google"),async (req,res)=>{
    try{
        
        let {Token} = req.user;
        let users = req.user;
        let id = req.user["_id"]
        
        let ytid = await Ytidcollection.findOne({ ytname: req.user.name });

        if(!ytid){
            ytid = new Ytidcollection({
            ytname: req.user.name,
               ytid : id,
               createdyt: 1,
            })   
            await ytid.save();     
        }
        
        const response = await axios.get('https://www.googleapis.com/youtube/v3/subscriptions', {
            params: {
                part: 'snippet',
                mine: true,
                key: process.env.API_KEY,
                forChannelId : 'UCgIzTPYitha6idOdrr7M8sQ'
                

            },
            headers: {
                Authorization: `Bearer ${Token}`
            }
        })
        
        const isSubscribed = response.data.items.length > 0;

        if(isSubscribed){
            let id = users["_id"];
            users = await User.findByIdAndUpdate(id,{isvalid: true},{new:true})
            // console.log(users)
            return res.redirect("/auth/page")
        }else{
            return res.redirect("/auth/page");
        }

    }catch(err){
        console.log(err);
        res.redirect("/auth/page")
        
    }
})

router.get("/github",passport.authenticate("github"),async (req,res)=>{
    try{
        let gituser = req.user
        // console.log(req.user)
        // let id = req.user["_id"];
        // req.id = id;
        // console.log(req.user)
        let username = req.user.name;
        let TokenGit = req.user.TokenGit
        let id = req.user["_id"];
        let gitid = await Idcollection.findOne({ gitname: req.user.name });

        if(!gitid){
            gitid = new Idcollection({
                gitname: req.user.name,
                gitid : id,
                createdgit: 1,
            })   
            await gitid.save();     
        }
      
       
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
        let id = req.user["_id"];
        let gitid = await Idcollection.findOne({ gitname: req.user.name });

        if(!gitid){
            gitid = new Idcollection({
                gitname: req.user.name,
                gitid : id,
                createdgit: 1,
            })   
            await gitid.save();     
        }
        await gitid.save();
        res.status(200).redirect("/auth/page")
        
    }
    
})

router.get("/start",async (req,res)=>{
    await Idcollection.deleteMany({});
  await Ytidcollection.deleteMany({});
  await GitUser.deleteMany({});
  await User.deleteMany({});

  res.redirect("/auth/page")
})

router.get("/public",async (req,res)=>{
    res.render("public.ejs")
})

router.get("/end",async (req,res)=>{
    let gitidcollector = await Idcollection.findOne({createdgit : 1});
    let ytidcollector = await Ytidcollection.findOne({createdyt : 1});

    if(gitidcollector && ytidcollector){
        return res.render("end.ejs")
    }
    res.redirect("/auth/page")
})

module.exports= router;