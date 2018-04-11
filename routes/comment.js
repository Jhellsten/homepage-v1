var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/new", function(req, res){
    res.render("new");
});
router.post("/new", function(req, res){
    res.render("/new");
});


router.get("/edit", function(req, res){
    res.render("edit");
});


module.exports = router;