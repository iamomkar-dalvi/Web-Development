
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
app.get("/",function(req,res){
	res.render("main");
});
app.get("/campgrounds",function(req,res){
	//Get all campgrounds
	//console.log(req.user);
	Campground.find({},function(err,campgrounds){
		if(err)
		{
			console.log("Error");
			console.log(err);
		}
		else
		{
			res.render("campground",{camps:campgrounds, currentUser:req.user});		
		}
	});
	
});
//Create new campground
app.get("/campgrounds/new",function(req,res){
	res.render("new");
});
//show route 
app.get("/campgrounds/:id",function(req,res){
	//capture id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err)
		{
			console.log("Error");
			console.log(err);
		}
		else
		{
			console.log(foundCampground);
			res.render("show",{camp:foundCampground});
		}
	});
	
});
//Add new Campground to database
app.post("/campgrounds",function(req,res){
	var name = req.body.campName;
	var iurl = req.body.campImg;e 
	var desc = req.body.campDesc;
	var newCampground = {name:name , image:iurl , description:desc};
	Campground.create(newCampground,function(err,campground){
		if(err)
		{
			console.log("Error");
			console.log(err);
		}
		else
		{
			res.redirect("/campgrounds");
		}
	});
	
});

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	Campground.findById(req.params.id, function(err,camp){
		if(err)
		{
			console.log("Error");
			console.log(err);
		}
		else
		{
			res.render("newComment",{camp:camp});
		}
	});
		
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err)
		{
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{
			Comment.create(req.body.comment, function(err,comment){
				if(err)
				{
					console.log("Error");
				}
				else
				{
					foundCamp.comments.push(comment);
					foundCamp.save();
					console.log("New Comment Added");
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	});
});



//Auth Routes 

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
 
 User.register(new User({username: req.body.username}), req.body.password, function(err,user){
 	if(err)
 	{
 		console.log(err);
 		return res.render("register");
 	}
 	passport.authenticate("local")(req,res ,function(){
 		res.redirect("/campgrounds");
 	});

 });
});


//login logic 

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds", failureRedirect:"/login"}),function(req,res){

});

//logout 

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds");
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");

}
app.listen(3000,function(){
	console.log("YelpCamp is live");
});