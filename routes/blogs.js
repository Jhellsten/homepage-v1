var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/", function(req, res){
	Blog.find({}, function(err, allBlogs){
		if(err){
			console.log(err);
		} else {
			res.render("blogs", {blogs:allBlogs, currentUser:req.user});
		}
	});

});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("blogs/new");
});

router.post("/new", middleware.isLoggedIn, function(req, res, next){
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

// Show blog route
router.get("/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
		if (err){
			req.flash("error", {error: err.message});
			console.log(err);
		} else {
			res.render("blogs/show", {blog: foundBlog});
		}
	});
});
// Edit blogs route
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if (err){
			console.log(err);
		} else {
			res.render("blogs/edit", {blog: foundBlog});
		}
	});
});

router.put("/:id", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if (err){
			req.flash("error", {error: err.message});
			console.log(err);
		}   else {
			res.redirect("/blogs/" + req.params.id);
			req.flash("success", "Blog was successfully updated!");  
		}
	});
});

router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", {error: err.message});
			res.redirect("/blogs");
		} else {
			req.flash("success", blog.name + " was successfully removed!");
			res.redirect("/blogs");
		}
	});
});

module.exports = router;