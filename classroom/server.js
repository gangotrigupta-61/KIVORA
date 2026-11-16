const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");

app.get("/",(req,res)=>{
    res.send("Root directory working!!")
});

app.use("/users",users);
app.use("/posts",posts);

app.listen("3000",()=>{
   console.log("Listening on Port 3000");
});