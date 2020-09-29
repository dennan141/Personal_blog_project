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

    const blog = db.getGuestBlogById(id, function(error, guestblogposts){
        if(error){
            //Do something
            console.log(error)
        }
        else{
            const model = {
                guestblogposts
            }
            console.log(guestblogposts)
            
            response.render("guestBlog.hbs", model)
        }
    })
})

//CREATE new guest_blogpost

router.get("/create-blogpost", function (request, response) {
    response.render("create-guestBlogpost.hbs")
})

router.post("/create-blogpost", function (request, response) {
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description

    db.createNewBlogpost(title, content, description, function (error) {
        if (error) {
            //Do something
            console.log(error)
        }
        else {
            response.redirect("/guestblog")
        }
    })

})

//POST DELETE spec guest_blogpost
router.post("/delete-guestblog/:id", function (request, response) {
    const id = request.params.id

    db.deleteGuestBlogpost(id, function (error) {
        if (error) {
            console.log(error)
        }
        else {
            response.redirect("/guestblog")
        }
    })
})

module.exports = router