const express = require("express");
const router = express.Router();
const {registerUser, loginUser, currentUser} = require("../controllers/userController");
const {validateToken} = require("../middleware/validateTokenHandler");

router.post("/register", registerUser);
router.post("/login", loginUser);
// To Fected the details of current login user.
router.get("/me", validateToken, currentUser);

module.exports = router;
