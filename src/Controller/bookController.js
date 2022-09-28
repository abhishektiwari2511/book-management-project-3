const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const { isValidRequestBody, valid } = require("../Validator/validate")
const userModel = require("../model/userModel");
const moment = require("moment");
const aws=require("aws-sdk") //AWS

const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let CurrentDate = moment().format("DD MM YYYY hh:mm:ss");

        let userDetails = await userModel.findById(data["userId"]);


        if (!userDetails) {
            return res.status(400).send({ status: false, msg: " User does not Exist." });
        }


        if (data["isdeleted"] == true) {
            data["deletedAt"] = CurrentDate;
        }

        let newbook = await bookModel.create(data)
        res.status(201).send({ status: true, msg: "success", data: newbook })
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}

const getAllBook = async function (req, res) {
    try {
        const queryParams = req.query
        if (queryParams.userId && !queryParams.userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect userId" })
        }
        let findBooks = await bookModel.find({ ...queryParams, isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        findBooks.sort(function (a, b) {
            return a.title.localeCompare(b.title)
        })
        if (!findBooks && findBooks.length == 0) {
            return res.status(404).send({ status: false, message: "Books not found" })
        }
        return res.status(200).send({ status: true, message: "Books list", data: findBooks })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBooksByPathParam = async function (req, res) {
    try {
        let bookIDEntered = req.params.bookId
        //===================== Checking the input value is Valid or Invalid =====================//
        if (!(bookIDEntered)) return res.status(400).send({ status: false, message: "Enter a book id" });

        let fullBookDetails = await bookModel.find({ bookIDEntered, isDeleted: false })
        //===================== Checking Book Exsistance =====================//
        if (!fullBookDetails) return res.status(404).send({ status: false, message: 'Book Not Found' })
        //===================== Getting Reviews of Book =====================//
        let reviewsData = await reviewModel.find({ bookId: bookIDEntered })
        // let reviewsData = []
        let data = { fullBookDetails, reviewsData: reviewsData }
        return res.status(200).send({ status: true, message: 'Books list', data: data })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

const updateBookbyId = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        let { title, excerpt, releasedAt, ISBN } = req.body
        //=====================Checking the validation=====================//
        if (!valid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "please enter data in body" });

        //===================== Checking Book Exsistance =====================//
        let booksData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!booksData) return res.status(404).send({ status: false, message: "No Books Found using BookID" })

        //=====================Validation of title=====================//
        if (title) {
            if (!(/^[a-zA-Z0-9\s\-,?_.]+$/).test(title)) return res.status(400).send({ status: false, message: "format of title is wrong!!!" });
            if (!valid(title)) return res.status(400).send({ status: false, message: "invalid title details" });
            let findTitle = await bookModel.findOne({ title: title })
            if (findTitle) return res.status(409).send({ status: false, message: "title already exist" })

        }
        //=====================Validation of ISBN=====================//
        if (ISBN) {
            if (!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).test(ISBN)) return res.status(400).send({ status: false, message: "enter valid ISBN number" });
            let findISBN = await bookModel.findOne({ ISBN: ISBN })
            if (findISBN) return res.status(409).send({ status: false, message: "ISBN already exist" })
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

const deletebyId = async function(req, res) {

    try {
        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({
            status: false,
            message: "Enter a bookId"
        })
        let book = await bookModel.findById({_id:bookId,isDeleted:false})
        if (!book) {
            return res.status(404).send({ status: false, message: "NO such book exist" })

        };
        
        if (req.loggedInUser != book.userId) {
            return res.status(403).send({ status: false, message: "Not Authorised" })
        }

        let deletBook=await bookModel.findOneAndUpdate({ _id: bookId }, {
            isDeleted: true,
            deletedAt: new Date()
        },{new: true})
        return res.status(200).send({ status: true, message: "Book deleted successfully", data: deletBook})
    } catch (error) {
        return res.status(500).send({ message: error.message })

    }
}

// aws.config.update({
//     accessKeyId: "AKIAY3L35MCRVFM24Q7U",
//     secretAccessKeyId: "qGG1HE0qRixcW1T1Wg1bv+08tQrIkFVyDFqSft4J",
//     region: "ap-south-1"
// })
// =======================================AWS==========================
aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    // secretAccessKeyId: "9f+YFBVcSjZWM6DG9R4TUN8k8TGe4X+lXmO4jPiU",
    secretAccessKey: "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",
    region: "ap-south-1"
})


let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "Group15/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

    // let data= await s3.upload( uploadParams)
    // if( data) return data.Location
    // else return "there is an error"

   })
}

const awsLink= async function(req, res){
    try{
        let bookId=req.params.bookId
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            let updatedBook = await bookModel.findByIdAndUpdate(bookId, { BookCover: uploadedFileURL }, { new: true })
            // console.log(uploadedFileURL)
            // console.log(updatedBook)
        res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL, updatedBook: updatedBook})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
}

    // ======================================
module.exports.createBooks = createBooks
module.exports.getAllBook = getAllBook
module.exports.getBooksByPathParam = getBooksByPathParam
module.exports.updateBookbyId = updateBookbyId
module.exports.deletebyId = deletebyId
module.exports.awsLink=awsLink
// module.exports={createBooks,getAllBook,getBooksByPathParam, updateBookbyId,deletebyId};
