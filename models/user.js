const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongosse = require("passport-local-mongoose");

const userSchema  = new Schema({
    name: {
        type:String,
    },
    email : {
        type: String,
    },
    googleId: {
        type:String,
    },
    image:{
        type: String,
    },
    Token: {
        type: String,
    },
    isvalid: {
        type: Boolean,
    }

});

userSchema.plugin(passportlocalmongosse);

module.exports = mongoose.model("User",userSchema);
