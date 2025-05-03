const express = require("express");


const router = express.Router(); 

const users = require("../data/user.js")

router.get("/", (req, res)=>{
    res.send(users);
})

module.exports = router;
