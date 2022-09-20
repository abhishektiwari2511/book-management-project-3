//===================== Checking the input value is Valid or Invalid =====================//
const valid = function (value) {
    if (typeof value == "number" || typeof value == "undefined" || typeof value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0;
};

//===================== Checking the input value with Regex =====================//
const regForName = function (value) { return (/^[A-Z][a-z]{1,}(?: [A-Z][a-z]+){0,}$/gm).test(value) }

const regForTitle = function (value) { return (/^(Mr|Mrs|Miss)+$\b/).test(value) }

const regForEmail = function (value) { return (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(value) }

const regForMobileNo = function (value) { return (/^((\+91)?|91)?[789][0-9]{9}$/g).test(value) }


const regForPassword= function (value) { return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{8,15}$/).test(value) }

// const regForPassword= function (value) { return (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/).test(value) }

// const regForPassword= function (value) { return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 15}$/).test(value) }

//=====================Module Export=====================//
module.exports = { valid, regForName, regForTitle, regForEmail, regForMobileNo,regForPassword, isValidRequestBody}