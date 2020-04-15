var mongoose = require("mongoose");

var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");


var data = [
	{
		name : "Clouds Rest",
		image : "https://californiathroughmylens.com/wp-content/uploads/2017/07/clouds-rest-20-640x427.jpg",
		description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name : "Desert Mesa ",
		image : "https://i.pinimg.com/originals/fa/17/82/fa1782af0ecc34b7849c8a24f8385c8f.jpg",
		description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name : "Canyon's West",
		image : "https://grandcanyonwest.com/wp-content/themes/grandcanyonwest/library/code/resizer/?img=image4.jpg&scale=60&quality=50",
		description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	}
]

//Remove all campgrounds 
function seedDB(){
	Campground.remove({},function(err){
		if(err)
		{
			console.log("Error");
		}
		else
		{
			console.log("Removed All Campground");
			data.forEach(function(camp){
				Campground.create(camp,function(err,newCamp){
					if(err)
					{
						console.log("Error");
					}
					else
					{
						console.log("Campground added");
						Comment.create({text:"This is a beautiful view",
												author:"Ceasar"},function(err,comment){
													if(err)
													{
														console.log("Error");
													}
													else
													{
														newCamp.comments.push(comment);
														newCamp.save();
														console.log("Comment Created");
													}
												});
					}
				});
			});
		}
	});
	//Add few campgrounds

	//add a few comments 
}


module.exports = seedDB;
