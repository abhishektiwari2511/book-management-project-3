const { mongoose } = require("mongoose")
const moment = require("moment")

// const valid = function (value) {
//     if (typeof value == "number" || typeof value == "undefined" || typeof value == null) { return false }
//     if (typeof value == "string" && value.trim().length == 0) { return false }
//     return true
// }



// //===================== Checking the input value with Regex =====================//
// const regForName = function (value) { return (/^[A-Z][a-z]{1,}(?: [A-Z][a-z]+){0,}$/gm).test(value) }

// const regForTitle = function (value) { return (/^(Mr|Mrs|Miss)+$\b/).test(value) }

// const regForEmail = function (value) { return (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(value) }

// const regForMobileNo = function (value) { return (/^((\+91)?|91)?[789][0-9]{9}$/g).test(value) }


// const regForPassword= function (value) { return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{8,15}$/).test(value) }

// // const regForPassword= function (value) { return (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/).test(value) }

// // const regForPassword= function (value) { return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 15}$/).test(value) }

// //=====================Module Export=====================//
// //module.exports = { valid, regForName, regForTitle, regForEmail, regForMobileNo,regForPassword, isValidRequestBody}


//===================================================function for validation============================================================
const checkInputsPresent = (value) => { return (Object.keys(value).length > 0) };

const isValidTitleA = function(title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidName = function(body) {
    const nameRegex = /^[a-zA-Z_ ]*$/
    if (body.trim().length == 0)
        return false

    return nameRegex.test(body)
}

const isvalidMobileNo = (number) => {
    return (/^((\+91)?|91)?[789][0-9]{9}$/g).test(number);
}


// const regForMobileNo = function (value) { return (/^((\+91)?|91)?[789][0-9]{9}$/g).test(value) }

const isValidEmail = function(value) {
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value);
}

const isValidPassword = function(Password) {
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/
    return passRegex.test(Password)
}

const isValidTitle = function(body) {
    const nameRegex = /^[A-Za-z0-9\s\-_,\.;?:()]+$/ // {/^[a-zA-Z_ ]*$/}

    return nameRegex.test(body)
}

const isValidUserId = function(value) {
    return mongoose.isValidObjectId(value)
}

const valid = function(value) {
    if (typeof value == "number" || typeof value == "undefined" || typeof value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}

const isvalidISBN = function(ISBN) {

    const isbnRejex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    return isbnRejex.test(ISBN)

}

const isValidreleasedAt = function(value) {
    let CurrentDate = moment().format("YYYY-MM-DD").toString()

    if (value === CurrentDate) {
        return true;
    } else {
        return false;
    }
}



//////////////////////////////////////User Validation///////////////////////////////////////////////////////////////
const userValidation = function(req, res, next) {
    let userDetails = req.body;
    if (!checkInputsPresent(req.body)) return res.status(400).send({ status: false, Error: "Body is Empty please provide details" });

    let { title, name, phone, email, password } = {...userDetails }

    if (!title) { return res.status(400).send({ status: false, msg: "title is required" }); }
    if (!name) { return res.status(400).send({ status: false, msg: "name is required" }); }
    if (!phone) { return res.status(400).send({ status: false, msg: "phone is required" }); }
    if (!email) { return res.status(400).send({ status: false, msg: "email is required" }); }
    if (!password) { return res.status(400).send({ status: false, msg: "password is required" }); }

    let [Title, Name, Phone, Email, Password] = [isValidTitleA(title), isValidName(name), isvalidMobileNo(phone), isValidEmail(email), isValidPassword(password)]





    if (!Title) {
        return res.status(400).send({ status: false, message: "Enter valid Title" });
    }

    // const isvalidname2 = function(value) {
    //     if (typeof value === "string" && value.trim().length > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    if (!Name) {
        return res.status(400).send({ status: false, message: "Enter valid Name" });
    }

    if (!Phone) {
        return res.status(400).send({ status: false, message: "Enter valid Phone" });
    }
    if (!Email) {
        return res.status(400).send({ status: false, message: "Enter valid Email" });
    }
    if (!Password) {
        return res.status(400).send({ status: false, message: "Enter valid Password" });
    }
    next();
}

///////////////////////////////////////Book Validation///////////////////////////////////////////////////////////////

const bookValidation = function(req, res, next) {

    let bookDetails = req.body;
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = {...bookDetails }
    if (!checkInputsPresent(req.body)) return res.status(400).send({ status: false, Error: " Body is Empty please Enter details" });

    if (!title) {
        return res.status(400).send({ status: false, msg: "title is required" });
    }
    if (!excerpt) {
        return res.status(400).send({ status: false, msg: "excerpt is required" });
    }
    if (!userId) {
        return res.status(400).send({ status: false, msg: "userId is required" });
    }
    if (!ISBN) {
        return res.status(400).send({ status: false, msg: "ISBN is required" });
    }
    if (!category) {
        return res.status(400).send({ status: false, msg: "category is required" });
    }
    if (!subcategory) {
        return res.status(400).send({ status: false, msg: "subcategory is required" });
    }
    if (!releasedAt) {
        return res.status(400).send({ status: false, msg: "releasedAt is required" })
    }


    let [Title, Excerpt, UserId, isbn, Category, Subcategory, ReleasedAt] = [isValidTitle(title), isValidTitle(excerpt), isValidUserId(userId), isvalidISBN(ISBN), isValidName(category), isValidName(subcategory), isValidreleasedAt(releasedAt)];

    if (!Title) {
        return res.status(400).send({ status: false, message: "Enter valid Title" });
    }

    if (!Excerpt) {
        return res.status(400).send({ status: false, message: "Enter valid excerpt" });
    }
    if (!isbn) {
        return res.status(400).send({ status: false, message: "Enter a valid ISBN " })
    }
    if (!UserId) {
        return res.status(400).send({ status: false, message: "Enter valid UserId" });
    }

    if (!Category) {
        return res.status(400).send({ status: false, message: "Enter valid Category" });
    }

    if (!Subcategory) {
        return res.status(400).send({ status: false, message: "Enter valid Subcategory" });
    }
    if (!ReleasedAt) {
        return res.status(400).send({ status: false, msg: "Enter valid Released Date " })
    }

    next()
}





module.exports = { userValidation, bookValidation, checkInputsPresent, isValidTitleA, isValidName, isvalidMobileNo, isValidEmail, isValidPassword, isValidTitle, isValidUserId, isvalidISBN,valid,isValidreleasedAt } //regForTitle,regForName,regForEmail,regForMobileNo,regForPassword,valid};


// if (isEmailAlreadyUsed) {
//     return res.status(400).send({ status: false, message: `email address is already registered` })
// }