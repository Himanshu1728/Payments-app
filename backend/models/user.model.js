import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, // Correct
        unique: true,
    },
    FirstName: {
        type: String,
        required: true // Correct
    },
    LastName: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: true, // Correct
    }
});

const User = mongoose.model("User", UserSchema); // No need for 'new' here
export default User;
