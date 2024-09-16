const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongosse = require("passport-local-mongoose");

const userSchema  = new Schema({
    ytname:{
        type:String,
        required: true,
    },
   
    ytid: {
        type: String,
        required: true,
    },  
    createdyt: {
        type: Number,
    }
});

userSchema.plugin(passportlocalmongosse);

module.exports = mongoose.model("Ytidcollection",userSchema);
