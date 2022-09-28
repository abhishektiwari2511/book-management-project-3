const mongoose=require("mongoose")

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema= new mongoose.Schema({
    title: {type: String, required :true, enum:["Mr", "Mrs", "Miss"],trim:true},
    name: {type: String, required :true, trim:true},
    phone: {type: String, required :true, unique:true, trim:true},
    email: {
        type: String, required: true, trim: true, lowercase: true, unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }, 
    password: {type: String, required: true, trim: true,
        match:[/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{8,15}$/, "Please Enter valid Password"],
        minlength:8,
        maxLength:15
    },
    address: {
      street: {type: String},
      city: {type: String},
      pincode: {type: String}
    }
},{timeStamps: true})

module.exports= mongoose.model("BookManagementUserCollection",userSchema)