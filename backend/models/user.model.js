import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        require: true
    },
    LastName: {
        type: String,
        default:null,
    },
   password:{
    type:String,
    required:true,
   }
})

const Mage = new mongoose.model("User", UserSchema)