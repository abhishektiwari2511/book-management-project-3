const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
// const { valid } = require("../Validator/validate")
const moment=require("moment")

const isValidreleasedAt = function(value) {
    let CurrentDate = moment().format("YYYY-MM-DD").toString()

    if (value === CurrentDate) {
        return true;
    } else {
        return false;
    }
}
const createReview = async function (req, res) {
    try {
        let data = req.body;
        let id = req.params.bookId;
        const { bookId, rating,reviewedBy,review } = data
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: 'No input provided' }) }
        if (!(/^[0-9a-fA-F]{24}$/).test(id)) {
            return res.status(400).send({ status: false, message: "Please enter the valid book Id" })
        }
        if (!id) { return res.status(400).send({ status: false, message: 'please provide a valid id' }) }

        if(bookId ){
        if (id != bookId) { return res.status(400).send({ status: false, message: 'Please provide a valid book Id' }) }
        if(id == bookId){
            if (!bookId) { return res.status(400).send({ status: false, message: 'Please provide a valid Book Id' }) }
            let Books = await bookModel.findById(bookId);
            if (!Books) { return res.status(400).send({ status: false, message: 'there is no such id in database, please provide a valid book Id' }) }
        }
        }   
        let books = await bookModel.findById({_id:id});
        if (!books) { return res.status(404).send({ status: false, message: 'No book found with this id, please check your input' }) }
        
        let is_Deleted = books.isDeleted;
        if (is_Deleted == true) { return res.status(404).send({ status: false, message: 'Book is deleted, unable to find book' }) }

        if (reviewedBy) {
            if (!(reviewedBy)) return res.status(400).send({ status: false, message: " Plz enter Valid reviewedBY" })
            if (!(/^[A-Za-z -.]+$/).test(reviewedBy)) return res.status(400).send({ status: false, message: " reviewedBY can not be a number" })
        }

        if (!rating) { return res.status(400).send({ status: false, message: "Rating is required" }) }
        
       
        if (rating < 1 || rating > 5) { return res.status(400).send({ status: false, message: "Rating must be minimum 1 and maximum 5" }) }
        if(!review){ return res.status(400).send({ status: false, message: "review is required" })}
         if(!(/^[A-Za-z -.]+$/).test(review)){return res.status(400).send({status:true,message:"review must be in charter "})}
        if(!data.reviewedAt){return res.status(400).send({ status: false, message: "reviewed at is required" })}
        if((data.reviewedAt)){
            validReview=isValidreleasedAt(data.reviewedAt)
            if(!validReview){return res.status(400).send({status:false,msg:"ReleasedAt should be Current Date and formate is yyyy-mm-dd"})}
        }
       
        let updatedBook = await bookModel.findOneAndUpdate({ _id: id }, { $inc: { reviews: +1 } }, { new: true })
        
        const reviews = await reviewModel.create(data);
        let obj ={}
         obj = {updatedBook,reviews}
        // updatedBook= updatedBook.toObject()
        // updatedBook.review=reviews
        //  let obj = updatedBook
        return res.status(201).send({ status: true, message: 'success', data: obj })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
///////////////////////////////////////Update Review////////////////////////////////////////////////////////////////
const valid = function (value) {
    if (typeof value == "number" || typeof value == "undefined" || typeof value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}
//PUT /books/:bookId/review/:reviewId

const updateReviewByBookId = async function(req,res){
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId;


        const { review, rating, reviewedBy} = req.body

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Body Can't be Empty " })
         if (!(/^[0-9a-fA-F]{24}$/).test(bookId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid book Id" })
        }
        if (!(/^[0-9a-fA-F]{24}$/).test(reviewId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid reviewId Id" })
        }
        if (!valid(reviewId)) return res.status(400).send({ status: false, message: "Review Id is Invalid !!!!" })
        if (!valid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        if (reviewedBy) {
            if (!valid(reviewedBy)) return res.status(400).send({ status: false, message: " Plz enter Valid reviewedBY" })
            if (!(/^[A-Za-z -.]+$/).test(reviewedBy)) return res.status(400).send({ status: false, message: "oops! reviewedBY can not be a number" })
        }
        if (rating) {
            if (!(rating >= 1 && rating <= 5)) return res.status(400).send({ status: false, message: " Plz enter Rating between [1-5]" })
        }

        let findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false, }); //check id exist in review model
        if (!findReview) return res.status(404).send({ status: false, message: "Review not exist as per review Id in URL", });

        //bookId exist in our database
        let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean(); //check id exist in book model
        if (!findBook) return res.status(404).send({ status: false, message: "Book not exist as per Book Id in URL" });

        const updateReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, req.body, { new: true });
        if (!updateReview) return res.status(404).send({ status: false, message: "This Review is Not Belongs to This Book!!!" });

        findBook.reviewData = updateReview;
        return res.status(200).send({ status: true, message: "Successfully Update review", data: findBook });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

//////////////////////////////////Delete review By Id//////////////////////////////////////////////////////////////

const deletebyreviewId = async function(req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if (!bookId) return res.status(400).send({ status: false, message: "please provide bookId" })
        if (!reviewId) return res.status(400).send({ status: false, message: "please provide reviewId" })
        if (!(/^[0-9a-fA-F]{24}$/).test(bookId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid book Id" })
        }
        if (!(/^[0-9a-fA-F]{24}$/).test(reviewId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid reviewId Id" })
        }
        let book = await bookModel.findById({_id:bookId})
       
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        let review = await reviewModel.findById({_id:reviewId})
        if (!review || review.isDeleted == true) {
            return res.status(404).send({ status: false, message: "review not found" })
        }
        if (review.bookId != bookId) {
            return res.status(404).send({ status: false, message: "Review not found for this book" })
        }

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })
         await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { review: -1 } })
        
        return res.status(200).send({ status: true, message: "Review deleted successfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

module.exports.createReview = createReview
module.exports.updateReviewByBookId = updateReviewByBookId

module.exports.deletebyreviewId = deletebyreviewId