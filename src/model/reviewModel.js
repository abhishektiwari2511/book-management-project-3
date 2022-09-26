const mongoose=require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema= new mongoose.Schema(
{
    bookId: {type: ObjectId, ref: 'BookCollection', required :true },
    reviewedBy: {type:String, required:true, default: 'Guest'},
    reviewedAt: {type:Date, required:true},
    rating: {type:Number, required:true, minlength:1,maxLength:5},
    review: {type:String},
    isDeleted: {type:Boolean, default: false}
  },{timestamps:true})

  module.exports= mongoose.model("reviews",reviewSchema)