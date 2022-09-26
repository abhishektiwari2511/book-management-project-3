//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const UserController = require("../Controller/userController");
const bookController = require("../Controller/bookController")
// const {createUser,login} = require("../Controller/userController");
// const {createBooks,getAllBook,getBooksByPathParam, updateBookbyId,deletebyId} = require("../Controller/bookController");
const {bookValidation} = require("../Validator/validate")
const {authentication,authorisation} = require("../middleware/auth")
const reviewController = require("../Controller/reviewController")


router.post("/register", UserController.createUser);
router.post("/login", UserController.login);
router.post("/books", authentication,authorisation,bookController.createBooks);
router.get("/books", bookController.getAllBook);
router.get("/books/:bookId", bookController.getBooksByPathParam);
router.put("/books/:bookId",bookController.updateBookbyId);
router.delete("/books/:bookId",authentication,authorisation, bookController.deletebyId);
router.post("/books/:bookId/review",authentication,authorisation, reviewController.createReview);
router.put("/books/:bookId/review/:reviewId",authentication,authorisation, reviewController.updateReviewByBookId);
router.delete("/books/:bookId/review/:reviewId",authentication,authorisation, reviewController.deletebyreviewId);






//=====================Module Export=====================//
module.exports = router;   