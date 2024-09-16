const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongosse = require("passport-local-mongoose");

const userSchema  = new Schema({

    gitname: {
        type: String,
        required: true
    
    },
    gitid: {
        type:String,
        required: true, 
       
    },
   
    createdgit: {
        type: Number,
    }
   
});

userSchema.plugin(passportlocalmongosse);

module.exports = mongoose.model("Idcollection",userSchema);
