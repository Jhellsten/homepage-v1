var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middlewareObj = require("../middleware");

router.get("/app", function(req, res){
	res.render("index")
});

module.exports = router;