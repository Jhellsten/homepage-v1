var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err){
				req.flash("error", "Blog not found");
				res.redirect("back");
			} else {
				// does user own the blog?
				if(foundBlog.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
                    
			}
		});
	} else {
		req.flash("error", "You need to be loggged in to do that!");
		res.redirect("back");
	}	
};


middlewareObj.checkCommentsOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				// Does user own the comment?
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in!");
		res.redirect("back");
	}	
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be loggged in to do that!");
	res.redirect("/login");
};

middlewareObj.shortenDesc = function(str, length, ending, next) {
	if (length == null) {
		length = 400;
	}
	if (ending == null) {
		ending = "...";
	}
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	} else {
	  return blog.description;
	} next();
};

module.exports = middlewareObj;