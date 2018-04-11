var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middlewareObj = require("../middleware");

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/login", function(req, res){
	res.render("login");
});
// Handling logic
router.post("/login", passport.authenticate("local", 
	{successRedirect: "/blogs", failureRedirect: "/login"}),
function(err, req, res){
});
router.get("/register", function(req, res){
    res.render("register");
});
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Janne's blogsite " + user.username);
            res.redirect("/blogs");
        });
    });
});

router.get("/about", function(req, res){
    res.render("about");
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/blogs");
});

module.exports = router;