const express = require('express')
const db = require("./db")
const router = express.Router();

router.use(express.static(__dirname + "/public"))


//GET all guest blogposts
router.get("/", function (request, response) {
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

//GET UPDATE guestblog with id
router.get("/update-guestblog/:id", function (request, response) {
    const id = request.params.id
    db.getGuestBlogById(id, function (error, guestblogpost) {
        if (error) {
            //Do something
            console.log(error)
        }
        else {
            const model = {
                guestblogpost
            }
            response.render("update-guestblog.hbs", model)
        }
    })
})

router.get("/create-blogpost", function (request, response) {
    response.render("create-guestBlogpost.hbs")
})



//GET spec guest Blogposts
router.get('/:id', function (request, response) {
    const id = request.params.id

    const blog = db.getGuestBlogById(id, function (error, guestblogposts) {
        if (error) {
            //Do something
            console.log(error)
        }
        else {
            const model = {
                guestblogposts
            }

            response.render("guestBlog.hbs", model)
        }
    })
})

//CREATE new guest_blogpost
router.post("/create-blogpost", function (request, response) {
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description
    const name = request.body.name

    db.createNewGuestBlogpost(title, content, description, name, function (error) {
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