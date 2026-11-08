const express = require("express");
const app=express();
const Listing=require("./models/listing.js");
const path=require("path");

const ejsMate=require("ejs-mate");

const mongoose=require("mongoose");

const MONGO_URL="mongodb://127.0.0.1:27017/kivora";

const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

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

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

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

//  Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    // console.log(allListing);
    res.render("listings/index.ejs",{allListing});
})
);

// New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listingdata= await Listing.findById(id);
    console.log(listingdata);
    res.render("listings/show.ejs",{listingdata});
}));

// show route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// create route
app.post("/listings",validateListing,
    wrapAsync(async(req,res,next)=>{

    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid data for listing!!");
    // }

   
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

    // if(!newListing.description){
    //     throw new ExpressError(404,"Description is missing!")
    // }
    //  if(!newListing.title){
    //     throw new ExpressError(404,"title is missing!")
    // }
    //  if(!newListing.location){
    //     throw new ExpressError(404,"location is missing!")
    // }

    // await newListing.save();
    // res.redirect("/listings");
})
);

// Update Route
app.put("/listings/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
    //   if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid data for listing!!");
    // }
    let {id}=req.params;
    // await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // let listingdata= await Listing.findById(id);
    // res.render("listings/show.ejs",{listingdata});

    
    // 1. Separate the image object from the rest of the text fields
    let { image, ...updateData } = req.body.listing;
    
    // 2. Perform the update on basic text fields first
    let listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    
    // 3. Handle the image object update safely
    if (image && image.url && image.url.trim() !== "") {
        listing.image = { url: image.url };
        await listing.save();
    }
    
    // 4. Redirect to the show page cleanly
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

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