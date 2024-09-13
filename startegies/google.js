const passport = require('passport');
const { Strategy: googleStrategy } = require("passport-google-oauth20")
const User = require('../models/User.js')

passport.use(new googleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/google",
        scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        try {
            
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {    
                return done(null, user);
            }
            
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id, 
            });

            await user.save();

            done(null, user);
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