const express = require('express')
const db = require("./db")
const router = express.Router();

router.use(express.static(__dirname + "/public"))


//GET all guest blogposts
router.get("/", function(request, response){
    db.getAllGuestBlogs(function (error, guestblogposts) {
        if (error) {
            console.log(error);
        } else {
            const model = {
                guestblogposts
            }
            response.render('guestBlogs.hbs', model)
        }
    })
})

//GET spec guest Blogposts
router.get('/:id', function (request, response) {
    const id = request.params.id

    const blog = db.getGuestBlogById(id, function(error, blogposts){
        if(error){
            //Do something
            console.log(error)
        }
        else{
            const model = {
                blogposts
            }
            console.log(blogposts)
            
            response.render("blog.hbs", model)
        }
    })
})

//CREATE new blogpost



module.exports = router