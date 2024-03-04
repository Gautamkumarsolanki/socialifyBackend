const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const { Jwt_secret } = require("../keys");

router.get('/', (req, res) => {
    res.send("hello")
})

router.post("/signup", (req, res) => {
    console.log(req.body);
    const { name, userName, email, password } = req.body;
    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    console.log(req.body);
    USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exist with that email or userName" })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {

            const user = new USER({
                name,
                email,
                userName,
                password: hashedPassword
            })

            user.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log(err) })
        })
    })




})

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" })
    }
    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" })
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                // return res.status(200).json({ message: "Signed in Successfully" })
                const token = jwt.sign({ _id: savedUser.id }, Jwt_secret)
                const { _id, name, email, userName } = savedUser

                res.json({ token, user: savedUser })

                console.log({ token, user: { _id, name, email, userName } })
            } else {
                return res.status(422).json({ error: "Invalid password" })
            }
        })
            .catch(err => console.log(err))
    })
})

router.post("/social-auth", async (req, res) => {
    console.log(req.body);
    try {
        const { oauth_token } = req.body;
        if (!oauth_token) {
            //error
        }
        const { email, name, picture } = jwt.decode(oauth_token);
        console.log(email);
        const userExist = await USER.findOne({ $or: [{ email: email }, { userName: email }] });
        if (userExist) {
            const token = jwt.sign({ _id: userExist.id }, Jwt_secret)
            const { _id, name, email, userName } = userExist

            res.json({ token, user: { _id, name, email, userName } })
        } else {
            const user = new USER({
                email, name, picture, userName: email
            });
            const savedUser = await user.save();
            const token = jwt.sign({ _id: savedUser.id }, Jwt_secret)
            const { _id, name, email, userName } = savedUser

            res.json({ token, user: { _id, name, email, userName } })
        }
    } catch (error) {
        // error
    }
})

module.exports = router;