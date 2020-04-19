
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
					
					//console.log("User is "+req.username);
					comment.author.id =req.user._id;
					comment.author.username = req.user.username;
					comment.save(); 
					foundCamp.comments.push(comment);
					foundCamp.save();
					console.log("New Comment Added");
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	});
});
//Edit Comment
router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
		Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err)
			{
				console.log(err);
				//res.redirect("back");
			}
			else{
				res.render("comments/edit",{comment:foundComment,campgroundID: req.params.id});
				//res.send("Edit Comments",);
			}
		});
});

router.put("/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
		if(err)
		{
			console.log(err);
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Delete 
router.delete("/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err,removedComment){
		if(err)
		{
			console.log(err);
			res.redirect("back");
		}
		else
		{
			res.redirect("/campgrounds/"+req.params.id);
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
function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated())
	{
		Comment.findById(req.params.comment_id, function(err,foundComment){
				if(err)
				{
					res.redirect("back");
				}
				else
				{
					if(foundComment.author.id.equals(req.user._id))
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