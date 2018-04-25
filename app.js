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
appRoutes = require("./routes/app");
Logging = require("./models/logging");
url = process.env.DATAURL || "mongodb://localhost/hellsten";
port = process.env.PORT || 3000;
    
mongoose.connect(url);

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
app.use("/app", appRoutes);

app.use(function(req, res, next){
	req.flash("error", "Page not found");
	res.redirect("/blogs");
});

app.use(function(err, req, res, next){
	Logging.error(err);
	next();
});

// app.listen(process.env.PORT, process.env.IP);

app.listen(port, function(){
	console.log("The server has started!");
});