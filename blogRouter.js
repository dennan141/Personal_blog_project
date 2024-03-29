const express = require('express')
const db = require("./db")
const router = express.Router();
const bodyParser = require('body-parser')

const TITLE_MAX_LENGTH = 100
const CONTENT_MAX_LENGTH = 4000
const DESCRIPTION_MAX_LENGTH = 500

router.use(express.static(__dirname + "/public"))
router.use(bodyParser.urlencoded({
    extended: false
}))

//Validation error checks-------------------
function blogValidationErrorCheck(title, content, description) {
    const validationErrors = []

    if (title.length <= 0) {
        validationErrors.push("Title is too short, please write a title!")
    }
    else if (title.length > TITLE_MAX_LENGTH) {
        validationErrors.push("Title can only be " + TITLE_MAX_LENGTH + " characters long, please shorten the title!")
    }
    if (content.length <= 0) {
        validationErrors.push("Content is too short, please write some content!")
    }
    else if (content.length > CONTENT_MAX_LENGTH) {
        validationErrors.push("Content can only be " + CONTENT_MAX_LENGTH + " characters, please shorten the content!")
    }
    if (description.length <= 0) {
        validationErrors.push("Description is too short, please write a description!")
    }
    else if (description.length > DESCRIPTION_MAX_LENGTH) {
        validationErrors.push("Description can only be " + DESCRIPTION_MAX_LENGTH + " charcaters, please shorten the description!")
    }
    return validationErrors
}

//GET all blogposts
router.get("/", function (request, response) {
    const isLoggedIn = request.session.isLoggedIn
    db.getAllBlogs(function (error, blogposts) {
        if (error) {
            console.log(error);
        } else {
            const model = {
                isLoggedIn,
                blogposts
            }
            response.render('blogs.hbs', model)
        }
    })
})

//GET UPDATE blogpost
router.get("/update-blogpost/:id", function (request, response) {

    const id = request.params.id
    const isLoggedIn = request.session.isLoggedIn

    if (isLoggedIn) {
        db.getBlogById(id, function (error, blogpost) {
            if (error) {
                //Do something
                console.log(error)
            }
            else {
                const model = {
                    blogpost,
                    errors: []
                }
                response.render("update-blogpost.hbs", model)
            }
        })
    }
    else {
        response.redirect("/login")
    }
})

//GET CREATE new blogpost
router.get("/create-blogpost", function (request, response) {

    const isLoggedIn = request.session.isLoggedIn

    if (isLoggedIn) {
        model = {
            errors: [],
            isLoggedIn
        }
        response.render("create-blogpost.hbs", model)
    }

    else {
        response.redirect("/login")
    }
})

//POST CREATE new blogpost
router.post("/create-blogpost", function (request, response) {
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description

    const errors = blogValidationErrorCheck(title, content, description)
    const isLoggedIn = request.session.isLoggedIn

    if (!isLoggedIn) {
        errors.push("You must be logged in!")
    }

    if (errors == 0) {

        db.createNewBlogpost(title, content, description, function (error) {
            if (error) {
                //Do something
                console.log(error)
            }
            else {
                response.redirect("/blogs")
            }
        })
    }
    else {
        response.redirect("/login")
    }
})

//GET spec Blogposts
router.get('/:id', function (request, response) {
    const id = request.params.id
    const isLoggedIn = request.session.isLoggedIn
    const blog = db.getBlogById(id, function (error, blogposts) {
        if (error) {
            response.render("serverError.hbs")
            console.log(error)
        }
        else if (blogposts == null) {
            response.render("notFound.hbs")
        } else {
            const model = {
                blogposts,
                isLoggedIn
            }
            response.render("blog.hbs", model)
        }
    })
})

//POST DELETE spec blogpost
router.post("/delete-blogpost/:id", function (request, response) {
    const id = request.params.id
    const isLoggedIn = request.session.isLoggedIn

    if (isLoggedIn) {
        db.deleteBlogpost(id, function (error) {
            if (error) {
                console.log(error)
            }
            else {
                response.redirect("/blogs")
            }
        })
    }
    else {
        response.redirect("/login")
    }


})

//POST UPDATE spec blogpost
router.post("/update-blogpost/:id", function (request, response) {
    const id = request.params.id
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description

    const errors = blogValidationErrorCheck(title, content, description)
    const isLoggedIn = request.session.isLoggedIn

    if (isLoggedIn) {
        if (errors == 0) {
            db.updateBlogpost(id, title, content, description, function (error) {
                if (error) {
                    console.log(error)
                }
                else {
                    response.redirect("/blogs/" + id)
                }
            })
        }

        else {
            const blogpost = { title, content, description }
            model = {
                errors,
                blogpost
            }
            response.render("update-blogpost.hbs", model)
        }
    }
    else {
        response.redirect("/login")
    }
})

module.exports = router

