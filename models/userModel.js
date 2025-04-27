const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({    
    username: {
        type: String,
        required: [true, "Please add the user name"],
    },
    email:{
        type: String,
        required: [true, "Please add the email"],
        unique: [true, "Email already exists"]
    },
    password:{
        type: String,
        required: [true, "Please add the password"],
    },
},
    {
        timestamp:true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;