const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require('cors');
const app = express();

app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true
  }));
app.use(express.json())
app.use(cookieParser());

const userRouter = require("./routes/users.js")
const authRouter = require("./routes/auth.js");

app.get("/", (req,res)=>{
    res.send("Hello");
})

app.use("/users", userRouter)
app.use("/auth", authRouter)

app.listen(3000);