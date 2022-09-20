const jwt = require("jsonwebtoken")
const userModel = require("../Model/userModel")
const { valid, regForName, regForTitle, regForEmail, regForMobileNo, regForPassword, isValidRequestBody } = require("../Validator/validate")




const createUser = async function (req, res) {
    try {
        const data = req.body
        const { title, name, phone, email, password, address } = data

        //===================== Checking the input value is Valid or Invalid =====================//
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body is empty, please provied data" });
        }


        //=====================Validation of Title=====================//
        if (!title) return res.status(400).send({ status: false, message: "title is required" })
        if (!(valid(title))) return res.status(400).send({ status: false, msg: "Provide a valid title" })
        if (!regForTitle(title)) return res.status(400).send({ status: false, msg: "Enter Title as Mr or Miss or Mrs" })

        //=====================Validation of Name=====================//

        if (!name) return res.status(400).send({ status: false, message: "Name is required" })
        if (!(valid(name))) return res.status(400).send({ status: false, msg: "Enter Valid Name" })
        if (!regForName(name)) return res.status(400).send({ status: false, msg: "Enter Valid Name in Alphabets" })

        //=====================Validation of Phone=====================//
        if (!phone) return res.status(400).send({ status: false, message: "phone is required" })
        if (!(valid(phone))) return res.status(400).send({ status: false, msg: "Provide a valid phone" })
        if (!regForMobileNo(phone)) return res.status(400).send({ status: false, msg: "Enter Valid Indian Number Starting with +91 or 91 followed by 10 Numbers or else enter 10 Numbers Starting with 7 or 8 or 9" })

        //=====================Checking the Duplication of Phone Number=====================//
        let duplicateMobile = await userModel.findOne({ phone: phone });
        if (duplicateMobile) return res.status(400).send({ status: false, message: "Mobile No. already exists!" });

        //=====================Validation of Email=====================//
        if (!email) return res.status(400).send({ status: false, message: "phone is required" })
        if (!(valid(email))) return res.status(400).send({ status: false, msg: "Provide a valid phone" })
        if (!regForEmail(email)) return res.status(400).send({ status: false, msg: "Enter Valid Email" })

        //=====================Checking the Duplication of Email=====================//
        let duplicateEmail = await userModel.findOne({ email: email });
        if (duplicateEmail) return res.status(400).send({ status: false, message: "Email already exists!" });


        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, message: "phone is required" })
        if (!(valid(password))) return res.status(400).send({ status: false, msg: "Provide a valid phone" })
        if (!regForPassword(password)) return res.status(400).send({ status: false, msg: "Please Enter Password With atleast one UpperCase,LowerCase,Number and special characters" })

        //=====================User Data Creation=====================//
        const newUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', newUser })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const login = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
        let data = req.body

        //=====================Checking the validation=====================//
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "Email and Password Required !" })

        //=====================Validation of EmailID=====================//
        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        if (!regForEmail(email)) return res.status(400).send({ status: false, msg: "Please Enter Valid Email ID" })

        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })

        //===================== Checking User exsistance using Email and password=====================//
        const user = await userModel.findOne({ email: email, password: password })
        if (!user) return res.status(401).send({ status: false, msg: "Email or Password Invalid Please try again !!" })

        //===================== Creating Token Using JWT =====================//
        const token = jwt.sign({
            userId: user._id.toString(),
            batch: "plutonium",
        }, "this is a private key", { expiresIn: '1d' })

        //===================== Decode Token Using JWT =====================//
        const decode = jwt.verify(token, "this is a private key")

        res.setHeader("x-api-key", token)
        console.log(decode)
        console.log(decode.exp)
        console.log(decode.iat)
        let expdate = new Date(parseInt(decode.exp) * 1000)
        let iatdate = new Date(parseInt(decode.iat) * 1000)
        console.log(expdate)
        console.log(iatdate)
        res.status(200).send({ status: true, message: 'Success', data: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.createUser = createUser
module.exports.login = login