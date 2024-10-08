const passport = require('passport');
const { Strategy: googleStrategy } = require("passport-google-oauth20")
const User = require('../models/user.js')
const { Strategy: GitHubStrategy } = require("passport-github2")

passport.use(new googleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://taskarjav.onrender.com/auth/google",
        scope: ['email', 'profile', "https://www.googleapis.com/auth/youtube.readonly"],
    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile)
        try {
            
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {   
                let id = user["_id"]
                user = await User.findByIdAndUpdate(id,{name:profile.displayName,Token:accessToken,isvalid: false},{new:true}); 
                return done(null, user);
            }
            
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                image:profile.photos[0].value,
               
                Token: accessToken,
                isvalid: false,
            });

            await user.save();

            done(null,user);
        } catch (error) {
            console.error(error);
            done(error, null);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
