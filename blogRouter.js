const express = require('express')
const db = require("./db")
const router = express.Router();
const bodyParser = require('body-parser')

router.use(express.static(__dirname + "/public"))
router.use(bodyParser.urlencoded({
    extended: false
}))

//GET all blogposts
router.get("/", function (request, response) {
    db.getAllBlogs(function (error, blogposts) {
        if (error) {
            console.log(error);
        } else {
            const model = {
                blogposts
            }
            response.render('blogs.hbs', model)
        }
    })
})

//CREATE new blogpost

router.get("/create-blogpost", function (request, response) {
    response.render("create-blogpost.hbs")
})

router.post("/create-blogpost", function (request, response) {
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description
    
    db.createNewBlogpost(title,content,description, function(error){
        if (error) {
            //Do something
            console.log(error)
        }
        else {
            response.redirect("/blogs")
        }
    })

})


//GET spec Blogposts
router.get('/:id', function (request, response) {
    const id = request.params.id

    const blog = db.getBlogById(id, function (error, blogposts) {
        if (error) {
            //Do something
            console.log(error)
        }
        else {
            const model = {
                blogposts
            }
            response.render("blog.hbs", model)
        }
    })
})


module.exports = router