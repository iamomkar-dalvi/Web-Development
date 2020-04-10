
var express =require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine","ejs");



//Schema setup 
var campSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
});
//Model Setup
var Campground = mongoose.model("Campground",campSchema);
//create data
// Campground.create({name:"SGNP",
// 					image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2b72d19e4cc250_340.jpg",
// 					description:"This is Sanjay Gandhi National Park"},
// 				 function(err,campground){
// 				 	if(err)
// 				 	{
// 				 		console.log(err);
// 				 	}
// 				 	else
// 				 	{
// 				 		console.log("New Campground");
// 				 		console.log(campground);

// 				 	}
// 				 });

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

app.get("/campgrounds/:id",function(req,res){
	//capture id
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err)
		{
			console.log("Error");
			console.log(err);
		}
		else
		{
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

app.listen(3000,function(){
	console.log("YelpCamp is live");
});