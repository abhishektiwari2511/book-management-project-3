const bookModel = require("../model/bookModel");
const userModel = require("../model/userModel");
const moment = require("moment");
const {mongoose, isValidObjectId}= require("mongoose");
const {valid}= require("../Validator/validate")

const createBooks = async function(req, res) {
    try {
        let data = req.body;
        let title = data["title"]
        let ISBN = data["ISBN"]
        let CurrentDate = moment().format("DD MM YYYY hh:mm:ss");

        let userDetails = await userModel.findById(data["userId"]);

        if (!userDetails) {
            return res.status(400).send({ status: false, msg: " User does not Exist." });
        }

        let existBooks = await bookModel.findOne({ title: title })
        if (existBooks) {
            return res.status(409).send({ status: false, msg: "title already in used Enter another title" })
        }
        let newexistBooks = await bookModel.findOne({ ISBN: ISBN })
        if (newexistBooks) {
            return res.status(409).send({ status: false, msg: "ISBN already in used" })
        }

        if (data["isdeleted"] == true) {
            data["deletedAt"] = CurrentDate;
        }

        let newbook = await bookModel.create(data)
        res.status(201).send({ status: true, msg: "success", data: newbook })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}


/////////////////////////////////////////////////////getBooks all /////////////////////////////////////////////////////////////////
const getAllBook = async function(req, res) {
        try {
            const queryParams = req.query
            if (queryParams.userId && !queryParams.userId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).send({ status: false, message: "Incorrect userId" })
            }
            let findBooks = await bookModel.find({...queryParams, isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1 })

            findBooks.sort(function(a, b) {
                return a.title.localeCompare(b.title)
            })
            if (findBooks && findBooks.length == 0) {
                return res.status(404).send({ status: false, message: "Books not found" })
            }
            return res.status(200).send({ status: true, message: "Books list", data: findBooks })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
    ///////////////////////////////////////////////get books by path param//////////////////////////////////////////////////
const getBooksByPathParam = async function(req, res) {
        try {
            let bookIDEntered = req.params.bookId


            //===================== Checking the input value is Valid or Invalid =====================//
          
            if (!(bookIDEntered)) return res.status(400).send({ status: false, message: "Enter a book id" });
           
            const ValidId= isValidObjectId(bookIDEntered)
            if(!ValidId){return res.status(400).send({status:false, message:"Enter valid BookId"})}
           
            let dat = await bookModel.findById(bookIDEntered)

            //===================== Checking Book Exsistance =====================//
            if (!dat) return res.status(404).send({ status: false, message: 'Book Not Found' })

            if (dat.isDeleted == true) return res.status(400).send({ status: false, message: `${dat.title} This Book is deleted` })

            //===================== Getting Reviews of Book =====================//
            // let reviewsData = await reviewModel.find({ bookId: bookIDEntered })
            let reviewsData = []
            let data = { dat, reviewsData: reviewsData }
            return res.status(200).send({ status: true, message: 'Books list', data: data })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }

    }
    ///////////////////////////////////////Update books///////////////////////////////////////////////////////////////
const updateBookbyId = async function(req, res) {
    try {
        let bookId = req.params.bookId;

        let { title, excerpt, releasedAt, ISBN } = req.body
            //=====================Checking the validation=====================//
    
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "please enter data in body" });

        //=====================Validation of title=====================//
        if (title) {
            if (!(/^[a-zA-Z0-9\s\-,?_.]+$/).test(title)) return res.status(400).send({ status: false, message: "format of title is wrong!!!" });
            if (!valid(title)) return res.status(400).send({ status: false, message: "invalid title details" });
            let findTitle = await bookModel.findOne({ title: title })
            if (findTitle) return res.status(400).send({ status: false, message: "title already exist" })

        }
        //=====================Validation of ISBN=====================//
        if (ISBN) {
            if (!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).test(ISBN)) return res.status(400).send({ status: false, message: "enter valid ISBN number" });
            let findISBN = await bookModel.findOne({ ISBN: ISBN })
            if (findISBN) return res.status(400).send({ status: false, message: "ISBN already exist" })
        }

        //=====================Validation of releasedAt=====================//
        if (releasedAt) {
            if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).test(releasedAt)) return res.status(400).send({ status: false, message: "date must be in format  YYYY-MM-DD!!!", });
        }
        //=====================Validation of excerpt=====================//
        if (excerpt) {
            if (!valid(excerpt)) return res.status(400).send({ status: false, message: "invalid excerpt details" });
        }

        //=====================Updating Bookd=====================//
        let updatedBook = await bookModel.findByIdAndUpdate(bookId, req.body, { new: true })
        return res.status(200).send({ status: true, data: updatedBook })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};
////////////////////////////////////////Deleted Books//////////////////////////////////////////////////////////////////

const deletebyId = async function(req, res) {
    try {
        let bookId = req.params.bookId;
        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required in path params" })
        }
       

        let findBookId = await bookModel.findById({ _id: bookId })
        if (!findBookId) {
            return res.status(404).send({ status: false, msg: "Book Not found" })
        }

         if (findBookId.loggedInUser != req.userId) {
            return res.status(403).send({ status: false, message: "You Are Not Unauthorized" });
         }

        let isDeletedBook = findBookId.isDeleted
        if (isDeletedBook == true) {
            return res.status(400).send({ status: false, msg: "Book is already deleted" })
        } else {
            const deleteBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
           let datadeleted=deleteBook.isDeleted
           let deletedtime=deleteBook.deletedAt
            return res.status(200).send({ status: true, message: "Book Deleted Successfully",isDeleted: datadeleted,deletedtime})
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = { createBooks, getAllBook, getBooksByPathParam, updateBookbyId, deletebyId };