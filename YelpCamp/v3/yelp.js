
var express =require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Comment = require("./models/comments")
var Campground = require("./models/campgrounds");
seedDB = require("./seed");

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine","ejs");


app.use(express.static(__dirname+"/public")); 
//Schema setup 

seedDB();

app.get("/",function(req,res){
	res.render("main");
});
app.get("/campgrounds",function(req,res){
	//Get all campgrounds
	Campground.find({},function(err,campgrounds){
		if(err)
		{
			console.log("Error");
			console.log(err);
		}
		else
		{
			res.render("campground",{camps:campgrounds});		
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
	var iurl = req.body.campImg;
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

app.get("/campgrounds/:id/comments/new",function(req,res){
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

app.post("/campgrounds/:id/comments",function(req,res){
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

app.listen(3000,function(){
	console.log("YelpCamp is live");
});