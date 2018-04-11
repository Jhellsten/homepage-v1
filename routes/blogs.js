var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Blog = require("../models/blog");

router.get("/new", function(req, res){
    res.render("blogs/new");
});

router.post("/new", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
		id: req.user._id,
		username: req.user.username
    };
    var newBlog = {name:name, image:image, description:description, author:author};
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/Blogs");
        }
    });
});

router.get("/", function(req, res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else {
            res.render("blogs", {blogs:allBlogs, currentUser:req.user});
        }
    });

});


router.get("/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if (err){
            console.log(err);
        } else {
            console.log(foundBlog);
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

module.exports = router;