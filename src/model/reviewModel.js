const mongoose=require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema= new mongoose.Schema(
{
    bookId: {type: ObjectId, ref: 'BookCollection', require :true },
    reviewedBy: {type:String, require:true, default: 'Guest'},
    reviewedAt: {type:Date, require:true},
    rating: {type:Number, require:true, minlength:1,maxLength:5},
    review: {type:String},
    isDeleted: {type:Boolean, default: false}
  },{timestamps:true})