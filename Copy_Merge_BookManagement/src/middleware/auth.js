const jwt = require("jsonwebtoken")
const bookModel = require("../model/bookModel")

const  authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.send({ status: false, msg: "token must be present" });

        // let decodedtoken = jwt.verify(token, "this is a private key");
        jwt.verify(token, "this is a private key", { ignoreExpiration:true }, //avoid the invalid error
         function (err, decodedtoken) {
            if (err) return res.status(401).send({ status: false, message: "Token is invalid" });
            if (Date.now() > decodedtoken.exp * 1000) 
                return res .status(401).send({ status: false, message: "Token expired" })

        // if (!decodedtoken) return res.send({ status: false, msg: "invalid token" })
    
        req.loggedInUser=decodedtoken.userId
     
        next()
         })
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
        if(toBeupdatedbookId){
        if (!(/^[0-9a-fA-F]{24}$/).test(toBeupdatedbookId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid book Id" })
        }
        //let bookDetails= await bookModel.findOne({_id:toBeupdatedbookId,isDeleted:false})
        //if(!bookDetails){return res.status(404).send({status:false, msg:"book not found"})}
        

            let updatinguserId = await bookModel.findById({ _id: toBeupdatedbookId }).select({ userId: 1, _id: 0 })
            if(!updatinguserId){return res.status(404).send({status:false, msg:"book not found"})}
            let userId = updatinguserId.userId
            console.log(userId)

            // let id = decodedtoken.userId
            let id = req.loggedInUser
            console.log(id)
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