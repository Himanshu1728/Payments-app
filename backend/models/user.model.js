import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        unique:true,
    },
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

const User = new mongoose.model("User", UserSchema);
export default User;