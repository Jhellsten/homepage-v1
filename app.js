var express = require("express");
    flash = require("connect-flash"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override");
    Blog = require("./models/blog"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    commentRoutes = require("./routes/comment"),
    blogRoutes = require("./routes/blogs"),
    authRoutes = require("./routes/index");
    clientErrorHandler = require("./middleware")

mongoose.connect("mongodb://localhost/hellsten");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
app.use(require("express-session")({
	secret: "Once again its going to gain once again",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", authRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

app.get("/*", function(req, res){
	req.flash("error", "Page could not be found", (function(){
		res.redirect("/");
	}));
});

// app.listen(process.env.PORT, process.env.IP);

app.listen(3000, function(){
	console.log("The server has started!");
});