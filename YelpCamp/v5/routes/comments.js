
var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

// Comment New 
router.get("/new",isLoggedIn,function(req,res){
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

//Post comment

router.post("/",isLoggedIn,function(req,res){
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
function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");

}

module.exports = router;