const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs"); //! npm i bcryptjs
const jwt = require("jsonwebtoken"); //! npm i jsonwebtoken
const fetchuser = require("../middleware/fetchuser"); //! Middleware
const { body, validationResult } = require("express-validator"); //!npm install --save express-validator
const router = express.Router();
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET; // signature token

//! Route 1: Create a User using: POST "/api/auth/createuser". Doesnt require Auth
router.post(
    "/createuser",
    [
        body("name").isLength({ min: 3 }),
        body("email", "Enter a valid Email address").isEmail(),
        body("password").isLength({ min: 8 }),
    ],

    // Boiler code from express validation
    async (req, res) => {
        let success = false;
        //For errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // using try catch for error handling
        try {

            // confirm that user does exsists or not
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                success = false;
                return res.status(400).json({ success, error: "Ops! User Already exsists" });
            }

            // Encoding password with hashing and salt
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            //storing user data in mongodb
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });

            const data = {
                user: {
                    id: user.id,
                },
            };

            // using token to identify user by givin a signature token to user
            const authToken = jwt.sign(data, JWT_SECRET);  //? (object cred, signature)
            success = true;
            res.json({success, authToken});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Something went wrong!");
        }
    }
);

//! Route 2:  Authenticate a User using : POST "/api/auth/login". No login required
router.post("/login",
    [
        body("email", "Enter a valid Email address").isEmail(),
        body("password", "Incorrect Password!").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        let success = false;
        //For errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                success = false;
                return res.status(400).json({ error: "Input valid credentials" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, error: "Input valid credentials" });
            }

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({success, authToken});

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Something went wrong - 102!");
        }
    }
);

//! Route 3:  Get logged-in User Details using : POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password") // selecting everythig except password
        res.json(user); //response
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong in line 116!");
    }
});

module.exports = router;