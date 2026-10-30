const express = require("express");
const app=express();
const Listing=require("./models/listing.js");
const path=require("path");

const ejsMate=require("ejs-mate");

const mongoose=require("mongoose");

const MONGO_URL="mongodb://127.0.0.1:27017/kivora";

const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await  mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("root directory working");
});

// app.get("/testlisting",(req,res)=>{
//     let samplelisting= new Listing({
//         title:"my new villa",
//         description:"selfmade",
//         price:1200,
//         location:"Lucknow",
//         country:"India"
//     });
//     res.send("testroute");
// });

app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({});
    // console.log(allListing);
    res.render("listings/index.ejs",{allListing});
});


app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});




app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let listingdata= await Listing.findById(id);
    console.log(listingdata);
    res.render("listings/show.ejs",{listingdata});
});

app.get("/listings/:id/edit", async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});


app.post("/listings",async(req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    let listingdata= await Listing.findById(id);
    res.render("listings/show.ejs",{listingdata});
});

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});



app.listen("8080",()=>{
    console.log("listening on port 8080");
});