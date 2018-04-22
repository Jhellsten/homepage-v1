var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middlewareObj = require("../middleware");

// Landing page
router.get("/", function(req, res){
	res.render("landing");
});
// Login page
router.get("/login", function(req, res){
	res.render("login");
});
// Login logic
router.post("/login", passport.authenticate("local", 
	{successRedirect: "/blogs", failureRedirect: "/login", failureFlash : true}),
function(err, req, res){
});
// Register page
router.get("/register", function(req, res){
	res.render("register");
});
// New user register
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Janne's blog site " + user.username);
			res.redirect("/blogs");
		});
	});
});
// About page
router.get("/about", function(req, res){
	res.render("about");
});
// Logout logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/blogs");
});

module.exports = router;