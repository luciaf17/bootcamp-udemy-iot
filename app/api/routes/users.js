const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models import
import User from "../models/user.js";


//POST = REQ.BODY
//GET REQ.QUERY

//REGISTER
router.post("/register", async (req, res) => {
    try {
        const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword
    }

    const user = await User.create(newUser);

    console.log(user);
    const toSend = {
        status: "success",
    }
    res.status(200).json(toSend);

    } catch (error) {
        console.log("ERROR - REGISTER API");
        console.log(error);
        const toSend = {
            status: "error",
            message: error
        };
        res.status(500).json(toSend);
        
    }
    
});


//LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    //método de mongo p/ buscar usuario por email
    var user = await User.findOne({ email: email });

    console.log(user);


    //if no email found
    if (!user) {
        const toSend = {
            status: "error",
            message: "Invalid Credentials"
        };
        return res.status(401).json(toSend);
    }

    //if user and email ok
    if (bcrypt.compareSync(password, user.password)) {

        //eliminar password de user p/ mo pasarla en el token
        user.set('password', undefined, {strict: false});
        
        const token = jwt.sign({userData: user}, "secret", {expiresIn: 60 * 60 * 24 * 30});
        const toSend = {
            status: "success",
            token: token,
            userData: user
        };
        return res.json(toSend);

    } else {
        const toSend = {
            status: "error",
            message: "Invalid Credentials"
        };
        return res.status(401).json(toSend);
    }
    res.json({"status": "success"});
});


module.exports = router;