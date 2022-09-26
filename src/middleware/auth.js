const jwt = require("jsonwebtoken")
const bookModel = require("../model/bookModel")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "login is required" })
        let decodedtoken = jwt.verify(token, "this is a private key")
        if (!decodedtoken) return res.status(401).send({ status: false, msg: "token is invalid" })
        req.loggedInUser=decodedtoken.userId
        next()
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}


const authorisation = async function (req, res, next) {
    try {
        // let token = req.headers["x-api-key"];
        // let decodedtoken = jwt.verify(token, "this is a private key")

        let toBeupdatedbookId = req.params.bookId
        if (toBeupdatedbookId) {

            let updatinguserId = await bookModel.findById({ _id: toBeupdatedbookId }).select({ userId: 1, _id: 0 })
            let userId = updatinguserId.userId

            // let id = decodedtoken.userId
            let id = req.loggedInUser
            if (id != userId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })
        }
        else {
            toBeupdatedbookId = req.body.userId
            // let id = decodedtoken.userId
            let id = req.loggedInUser
            

            if (id != toBeupdatedbookId) return res.status(403).send({ status: false, msg: 'You are not authorised to perform this task' })
        }

        next();
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}



module.exports = { authentication , authorisation }