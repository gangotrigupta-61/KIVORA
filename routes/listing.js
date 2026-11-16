const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");

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

//  Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    // console.log(allListing);
    res.render("listings/index.ejs",{allListing});
})
);

// New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listingdata= await Listing.findById(id).populate("reviews");
    console.log(listingdata);
    res.render("listings/show.ejs",{listingdata});
}));


router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// create route
router.post("/",validateListing,
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
router.put("/:id",
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

// delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);

module.exports=router;