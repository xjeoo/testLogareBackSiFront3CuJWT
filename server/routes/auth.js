require("dotenv").config()

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const users = require("../data/user.js")

router.post("/login", async (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;

  if( username.trim() === "" || password.trim() === "" ) return res.status(400).send("Fields missing!");

  const user = users.find((u)=>u.username === username);

  if(!user) return res.status(401).send("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  
  if(!valid) return res.status(401).send("Invalid credentials");

  const newUser = {
    username: username,
    id: 4
  }
  const access_token = generateAccessToken(newUser);

  const refresh_token = jwt.sign({
    username: username,
    id: 4
  }, 
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: "3d"
  })

  res.cookie("refresh_token", refresh_token,{
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3*24*60*60*1000
  })

  return res.json({
    username: username,
    access_token: access_token,
    access_token_type: "login"
  })

})

router.post("/register", async (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;

  if( username.trim() === "" || password.trim() === "" ) return res.status(400).send("Fields missing!");

  if(users.some((u)=>u.username === username)) return res.status(409).send("Username taken");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username: username,
    password: hashedPassword
  }

  users.push(newUser);

  return res.status(201).send("Success");

})

router.post("/verify", (req,res)=>{
  const authHeader = req.headers.authorization;
  const access_token = authHeader && authHeader.split(' ')[1];
  const refresh_token = req.cookies.refresh_token;
  if(!access_token) return res.status(401).send("Access token missing");

  try {
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).send("Access token valid");
  } catch (err) {
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
      if(err)return res.status(401).send("Refresh token expired");

      const newAccessToken = generateAccessToken({username: user.username});
      res.status(201).json({
        username: user.username,
        access_token: newAccessToken,
        access_token_type: "refresh"
      });
    })
  }

})

const generateAccessToken = (user)=>{
  return jwt.sign(user, 
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: "15m"
  }
)
}

const verifyToken = (req, res, next)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if(!token)return res.status(401).send("Token missing");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    if(err)return res.status(403).send("Token expired");
    req.user = user;
    next();
  })

}


module.exports = router;