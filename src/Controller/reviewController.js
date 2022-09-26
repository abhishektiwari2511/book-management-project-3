const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const { valid } = require("../Validator/validate")

const createReview = async function (req, res) {
    try {
        let data = req.body;
        let id = req.params.bookId;
        const { bookId, rating } = data
        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: "No input provided" }) }

        if (!id) { return res.status(400).send({ status: false, message: 'please provide a valid id' }) }

        if(bookId ){
        if (id != bookId) { return res.status(400).send({ status: false, message: 'Please provide a valid book Id' }) }
        }   
        let books = await bookModel.findById(id);
        if (!books) { return res.status(404).send({ status: false, message: 'No book found with this id, please check yout input' }) }

        let is_Deleted = books.isDeleted;
        if (is_Deleted == true) { return res.status(404).send({ status: false, message: 'Book is deleted, unable to find book' }) }

      if(bookId){
        if (!bookId) { return res.status(400).send({ status: false, message: 'Please provide a valid Book Id' }) }
        let Books = await bookModel.findById(bookId);
        if (!Books) { return res.status(400).send({ status: false, message: 'there is no such id in database, please provide a valid book Id' }) }
      }
        if (!rating) { return res.status(400).send({ status: false, message: "Rating is required" }) }

        if (rating < 1 || rating > 5) { return res.status(400).send({ status: false, message: "Rating must be minimum 1 and maximum 5" }) }

        data.reviewedAt = new Date();

        const updatedBook = await bookModel.findOneAndUpdate({ _id: id }, { $inc: { reviews: +1 } }, { new: true })
        const reviews = await reviewModel.create(data);
        return res.status(201).send({ status: true, message: "sucess", data: { ...updatedBook.toObject(), reviewsData: reviews } })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





// PUT /books/:bookId/review/:reviewId

const updateReviewByBookId = async function(req,res){
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId;

        const { review, rating, reviewedBy} = req.body

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Body Can't be Empty " })
        
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


const deletebyreviewId = async function(req, res) {
    try {
        let bookId = req.parms.bookId
        let reviewId = req.parms.reviewId
        if (!bookId) return res.status(400).send({ status: false, message: "please provide bookId" })
        if (!reviewId) return res.status(400).send({ status: false, message: "please provide reviewId" })
        let book = await bookModel.findbyId(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        let review = await reviewModel.findbyId(bookId)
        if (!review || review.isDeleted == true) {
            return res.status(404).send({ status: false, message: "review not found" })
        }
        if (review.bookId != bookId) {
            return res.status(404).send({ status: false, message: "Review not found for this book" })
        }

        newreview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })
        newBook = await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { review: -1 } })
        let updated = { newreview, newBook }
        return res.status(200).send({ status: true, message: "Review deleted successfully", data: updated })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

module.exports.createReview = createReview
module.exports.updateReviewByBookId = updateReviewByBookId

module.exports.deletebyreviewId = deletebyreviewId