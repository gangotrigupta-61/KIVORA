const express = require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/kivora";

// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

const {listingSchema,reviewSchema}=require("./schema.js");
// const Listing=require("./models/listing.js");
// const Review = require("./models/review.js");

const listing=require("./routes/listing.js");
const review=require("./routes/review.js");

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

app.use("/listings",listing);
app.use("/listings/:id/reviews",review);

// custom error handler
// app.use((err,req,res,next)=>{
//     res.send("Something went wrong!!");
// });

app.all("*any",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

// Express Error handler
app.use((err,req,res,next)=>{
   let {statusCode=500,message="Something went wrong!!"}=err;
   res.status(statusCode).render("error.ejs",{err});
//    res.status(statusCode).send(message);
});

app.listen("8080",()=>{
    console.log("server is listening on port 8080");
});