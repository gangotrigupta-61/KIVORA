const mongoose=require("mongoose");
const Review = require("./review.js");
const schema=mongoose.Schema;

const listingSchema=new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,

    // image:{
    //     type:String,
    //     default:"https://images.pexels.com/photos/36676879/pexels-photo-36676879.jpeg?cs=srgb&dl=pexels-aksinfo7-36676879.jpg&fm=jpg",
    //    set:(v)=> v ==="" ? "https://images.pexels.com/photos/36676879/pexels-photo-36676879.jpeg?cs=srgb&dl=pexels-aksinfo7-36676879.jpg&fm=jpg" : v,
    // },

    image: {
    filename: {
      type: String,
    //   default: "listingimage"
    default:"https://images.pexels.com/photos/36676879/pexels-photo-36676879.jpeg?cs=srgb&dl=pexels-aksinfo7-36676879.jpg&fm=jpg",
      set:(v)=> v ==="" ? "https://images.pexels.com/photos/36676879/pexels-photo-36676879.jpeg?cs=srgb&dl=pexels-aksinfo7-36676879.jpg&fm=jpg" : v,
    },
    url: {
      type: String,
      // required: true
    }
  },

    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[
      {
      type:schema.Types.ObjectId,
      ref:"Review",
    },
  ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if (listing){
      await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing ;
