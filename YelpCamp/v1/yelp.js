
var express =require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

var camp = [
		{name:"Hudson Peak", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2b73d39645c65d_340.jpg"},
		{name:"SGNP",image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2b73d39645c65d_340.jpg"},
		{name:"Tarkarli",image:"https://pixabay.com/get/52e3d5404957a514f6da8c7dda793f7f1636dfe2564c704c7d2b73d39645c65d_340.jpg"},
		{name:"Hudson Peak", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2b73d39645c65d_340.jpg"},
		{name:"SGNP",image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2b73d39645c65d_340.jpg"},
		{name:"Tarkarli",image:"https://pixabay.com/get/52e3d5404957a514f6da8c7dda793f7f1636dfe2564c704c7d2b73d39645c65d_340.jpg"}
	];

app.get("/",function(req,res){
	res.render("main");
});
app.get("/campgrounds",function(req,res){

	
	res.render("campground",{camps:camp});
});
app.get("/campgrounds/new",function(req,res){
	res.render("new");
});

app.post("/campgrounds",function(req,res){
	var name = req.body.campName;
	var iurl = req.body.campImg;
	var newCampground = {name:name , image:iurl};
	camp.push(newCampground);
	res.redirect("/campgrounds");
});

app.listen(3000,function(){
	console.log("YelpCamp is live");
});