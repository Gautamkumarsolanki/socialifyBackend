const express = require('express');
// const sendMessage = require('../controllers/messageController');

const router = express.Router();

router.post("/send/:id", async (req, res) => {
    console.log("Send Message")
});