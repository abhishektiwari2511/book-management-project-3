//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const UserController = require("../Controller/userController");

router.post("/register", UserController.createUser);

router.post("/login", UserController.login);







//=====================Module Export=====================//
module.exports = router;   