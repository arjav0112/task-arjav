const passport = require('passport');
const GitUser = require('../models/gituser.js')
const { Strategy: GitHubStrategy } = require("passport-github2")

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    callbackURL: "http://localhost:3001/auth/github",
    scope: ['user:email']
},async (accessToken,refreshToken,profile,done)=>{
    try {
            
        let gituser = await GitUser.findOne({ email: profile.emails[0].value });
        console.log(profile.photos[0].value)
        if (gituser) {   
            let id = gituser["_id"]
            gituser = await GitUser.findByIdAndUpdate(id,{name:profile.username,TokenGit:accessToken,isvalid: false},{new:true}); 
            
            return done(null, gituser);
        }
        
        gituser = new GitUser({
            name: profile.username,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            TokenGit: accessToken,
            isvalid: false,
        });

        await gituser.save();
        

        done(null,gituser);
    } catch (error) {
        console.error(error);
        done(error, null);
    }
}))

passport.serializeUser((gituser, done) => {
    done(null, gituser.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const gituser = await GitUser.findById(id);
        done(null, gituser);
    } catch (error) {
        done(error, null);
    }
});
