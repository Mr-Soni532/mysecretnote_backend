const jwt = require("jsonwebtoken");
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET; // signature token

const fetchuser = (req, res, next) => {
    
    //Get the user form the jwt and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Invalid Token " })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;
    } catch (error) {
        res.status(401).send({ error: "Invalid Token " })
    }
    next();
}

module.exports = fetchuser;
