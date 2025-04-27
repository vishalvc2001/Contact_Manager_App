const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please provide all the fields");
    }
    const userAvalilable = await User.findOne({ email: email });
    if (userAvalilable) {
        res.status(400);
        throw new Error("User already exists with this email");
    }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
    });
    if (user) {
        res.status(201).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("User data not valid");
    }
    console.log("User created successfully", user);
    res.json({ message: "User registered successfully" });
});

module.exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide all the fields");
    }

    const user = await User.findOne({ email });
    console.log("user details", user);
    // Compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate token
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
});

//@descCurrent user info
//@route POST /api/users/me
//@access Private
module.exports.currentUser = asyncHandler(async (req, res) => {
    res.json({data: req.user});    
});