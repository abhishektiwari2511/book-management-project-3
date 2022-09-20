const mongoose=require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema= new mongoose.Schema({
    title: {type: String, require :true, trim:true},
  excerpt: {type: String, require :true, trim:true}, 
  userId: {type: ObjectId, ref: 'UserCollection', require :true },
  ISBN: {type: String, require :true, trim:true, unique:true},
  category: {type: String, require :true, trim:true},
  subcategory:  [{ type: String, require: true }],
  reviews: {type: Number, default: 0},
  deletedAt: { type: Date}, 
  isDeleted: {type:Boolean, default: false},
  releasedAt: {type:Date, require: true},
},{timeStamps: true})

module.exports= mongoose.model("BookCollection",bookSchema)