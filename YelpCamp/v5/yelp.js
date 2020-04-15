
var express =require('express');
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var bodyParser = require("body-parser");
var Comment = require("./models/comments")
var Campground = require("./models/campgrounds");
var User = require("./models/user");
seedDB = require("./seed");

//Require Routes
var campgroundRoutes = require("./routes/campgrounds");
	commentRoutes = require("./routes/comments");
	indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine","ejs");


app.use(express.static(__dirname+"/public")); 
//Schema setup 

seedDB();

//passport configuration 
app.use(require("express-session")({
	secret:"Yelp camp first project",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
//Express Router

app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000,function(){
	console.log("YelpCamp is live");
});