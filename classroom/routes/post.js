const express=require("express");
const router=express.Router();

// Index-post
router.get("/",(req,res)=>{
    res.send("GET for post");
});

// Show-post
router.get("/:id",(req,res)=>{
    res.send("GET for post id");
});

// POST-post
router.post("/",(req,res)=>{
    res.send("POST for post");
});

// DELETE-post
router.delete("/:id",(req,res)=>{
    res.send("DELETE for post id");
});

module.exports=router;