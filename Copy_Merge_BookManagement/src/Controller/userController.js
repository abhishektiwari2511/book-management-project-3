const jwt = require("jsonwebtoken")
const userModel = require("../model/userModel")

const createUser = async function(req, res) {
        try {
            const data = req.body
            const { title, name, phone, email, password, address } = data
            //=====================Checking the Duplication of Email=====================//
            const newexistUser = await userModel.findOne({ phone: phone });
            if (newexistUser) { return res.status(409).send({ status: false, msg: "phone no already in used" }) }

            const existUser = await userModel.findOne({ email: email });
            if (existUser) { return res.status(400).send({ status: false, message: "email already exists!" }) }

            const createUser = await userModel.create(data)
            return res.status(201).send({ status: true, message: 'Success', data: createUser })

        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
    ////////////////////////////////////////////login part////////////////////////////////////////////////////////////////////
const login = async function(req, res) {
    try {
        // let email = req.body.email
        // let password = req.body.password
        let data = req.body
        const { email, password } = data
        //=====================Checking the validation=====================//
        if (!data) return res.status(400).send({ status: false, msg: "Email and Password Required !" })

        //=====================Validation of EmailID=====================//
        if (!email) return res.status(400).send({ status: false, msg: "email is required" })


        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })

        //===================== Checking User exsistance using Email and password=====================//
        const user = await userModel.findOne({ email: email, password: password })
        if (!user) return res.status(400).send({ status: false, msg: "Email or Password Invalid Please try again !!" })

        //===================== Creating Token Using JWT =====================//
        const token = jwt.sign({
            userId: user._id.toString(),
            batch: "plutonium",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
        }, "this is a private key")

        //===================== Decode Token Using JWT =====================//
        const decode = jwt.verify(token, "this is a private key")
      

        res.setHeader("x-api-key", token)

        let expdate = new Date(parseInt(decode.exp) * 1000)
        let iatdate = new Date(parseInt(decode.iat) * 1000)

        res.status(200).send({ status: true, message: 'Success', data: token, exp: expdate, iat: iatdate })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createUser, login };