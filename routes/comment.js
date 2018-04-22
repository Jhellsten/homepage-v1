var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var Blog = require("../models/blog");


router.get("/new", middleware.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if (err){
			req.flash("error", {error: err.message});
			console.log(err);
		} else {
			res.render("comments/new", {blog: blog});
		}
	});
});
// Post new comment
router.post("/new", middleware.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
		} else {
			// Create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					// Connect new comment to the blog
					// Add username and id to the comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					blog.comments.push(comment);
					blog.save();
					// When done redirect back to blog
					console.log(comment);
					req.flash("success", "Thanks for adding a comment");
					res.redirect("/blogs/" + blog._id);
				}
			});
		}
	});
});
// Edit comment page
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, FoundComment){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		} else {
			req.flash("success", "Thanks for adding a comment");
			res.render("comments/edit", {blog_id: req.params.id, comment: FoundComment});
		}
	});
});
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		} else {
			req.flash("success", "Comment has been edited");
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		} else {
			req.flash("success", "Comment has been deleted");
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

module.exports = router;