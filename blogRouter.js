const express = require('express')
const db = require("./db")
const router = express.Router();
const bodyParser = require('body-parser')

const TITLE_MAX_LENGTH = 25
const CONTENT_MAX_LENGTH = 500
const DESCRIPTION_MAX_LENGTH = 150

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

//GET UPDATE blogpost
router.get("/update-blogpost/:id", function (request, response) {
    const id = request.params.id
    db.getBlogById(id, function (error, blogpost) {
        if (error) {
            //Do something
            console.log(error)
        }
        else {
            const model = blogpost
            response.render("update-blogpost.hbs", model)
        }
    })
})

//CREATE new blogpost
router.get("/create-blogpost", function (request, response) {
    model = {
        validationErrors: []
    }
    response.render("create-blogpost.hbs")
})

router.post("/create-blogpost", function (request, response) {
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description

    const validationErrors = []

    //Validation error checks-------------------
    if (title.length <= 0) {
        validationErrors.push("Title is too short, please write a title!")
    }
    else if (title.length > TITLE_MAX_LENGTH) {
        validationErrors.push("Title can only be 50 characters long, please shorten the title!")
    }
    if (content.length <= 0) {
        validationErrors.push("Content is too short, please write some content!")
    } 
    else if (content.length > CONTENT_MAX_LENGTH) {
        validationErrors.push("Content can only be 500 characters, please shorten the content!")
    }
    if (description.length <= 0) {
        validationErrors.push("Description is too short, please write a description!")
    }
    else if (description.length > DESCRIPTION_MAX_LENGTH) {
        validationErrors.push("Description can only be 150 charcaters, please shorten the description!")
    }

    if(validationErrors == 0) {
        //----------------------------------
    
        db.createNewBlogpost(title, content, description, function (error) {
            if (error) {
                //Do something
                console.log(error)
            }
            else {
                response.redirect("/blogs")
            }
        })
    }else{
        model = {
            validationErrors,
            title,
            content,
            description
        }
        response.render("create-blogpost.hbs", model)
    }
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


//POST DELETE spec blogpost
router.post("/delete-blogpost/:id", function (request, response) {
    const id = request.params.id

    db.deleteBlogpost(id, function (error) {
        if (error) {
            console.log(error)
        }
        else {
            response.redirect("/blogs")
        }
    })
})

//POST UPDATE spec blogpost
router.post("/update-blogpost/:id", function (request, response) {
    const id = request.params.id
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description
    db.updateBlogpost(id, title, content, description, function (error) {
        if (error) {
            console.log(error)
        }
        else {
            response.redirect("/blogs/" + id)
        }
    })
})

module.exports = router

