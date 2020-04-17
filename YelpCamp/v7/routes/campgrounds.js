var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
router.get("/",function(req,res){
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
router.get("/new",isLoggedIn,function(req,res){
	res.render("new");
});
//show route 
router.get("/:id",function(req,res){
	//capture id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err)
		{
			console.log("Error");
			console.log(err);
		}
		else
		{
			//console.log(foundCampground);
			res.render("show",{camp:foundCampground});
		}
	});
	
});
//Add new Campground to database
router.post("/",isLoggedIn,function(req,res){
	var name = req.body.campName;
	var iurl = req.body.campImg;
	var desc = req.body.campDesc;
	var author ={
		id: req.user._id,
		username:req.user.username
	};
	var newCampground = {name:name , image:iurl , description:desc,author:author};
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

//Edit Campground 
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){

		Campground.findById(req.params.id, function(err,foundCampground){
			if(err)
			{
				console.log(err);
				res.redirect("back");
			}
			else{
				res.render("campground/edit",{camp:foundCampground});
			}
		});

	
});
//Update campground
router.put("/:id",checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err,UpdateCamp){
		if(err)
		{
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

router.delete("/:id",checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err,deletedCampground){
		if(err)
		{
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{
			res.redirect("/campgrounds");
		}
	});
});

//middle ware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");

}

function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated())
	{
		Campground.findById(req.params.id, function(err,foundCampground){
				if(err)
				{
					res.redirect("back");
				}
				else
				{
					if(foundCampground.author.id.equals(req.user._id))
					{
						next();
					}
					else{
						res.redirect("back");
					}
				}
			
		});
	}
	else{
		res.redirect("back");
	}
}

module.exports = router;