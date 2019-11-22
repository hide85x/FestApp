const mongoose= require('mongoose');
// const PassportLocalMongoose= require('passport-local-mongoose')
const Schema= mongoose.Schema;

const UserSchema= new Schema({
    email: {
        type:String,
        trim: true,
        unique:true,
        lowercase: true
    },
    name:String,
    password: String,
    facebookId: String
})

module.exports= mongoose.model("User", UserSchema)