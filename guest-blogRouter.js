const express = require('express')
const db = require("./db")
const router = express.Router();
const bodyParser = require('body-parser')

const TITLE_MAX_LENGTH = 100
const CONTENT_MAX_LENGTH = 4000
const DESCRIPTION_MAX_LENGTH = 500
const NAME_MAX_LENGTH = 50


router.use(express.static(__dirname + "/public"))
router.use(bodyParser.urlencoded({
    extended: false
}))

function guestblogValidationErrorCheck(title, content, description, name) {
    const validationErrors = []

    //Validation error checks-------------------
    if (title.length <= 0) {
        validationErrors.push("Title is too short, please write a title!")
    }
    else if (title.length > TITLE_MAX_LENGTH) {
        validationErrors.push("Title can only be " + TITLE_MAX_LENGTH + " characters long, please shorten the title!")
    }
    if (name.length <= 0) {
        validationErrors.push("Name is too short, please write a name!")
    }
    else if (name.length > NAME_MAX_LENGTH) {
        validationErrors.push("Name can only be " + NAME_MAX_LENGTH + " charcaters. The worlds longest sir name is: Wolfe­schlegel­stein­hausen­berger­dorff, how is yours longer?")
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
            const model = guestblogpost

            response.render("update-guestblog.hbs", model)
        }
    })
})

//GET CREATE new guestblog
router.get("/create-blogpost", function (request, response) {
    model = {
        validationErrors: []
    }
    response.render("create-guestBlogpost.hbs", model)
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
router.post("/create-guestblogpost", function (request, response) {
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description
    const name = request.body.name

    const validationErrors = guestblogValidationErrorCheck(title, content, description, name)

    if (validationErrors == 0) {
        db.createNewGuestBlogpost(title, content, description, name, function (error) {
            if (error) {
                //Do something
                console.log(error)
            }
            else {
                response.redirect("/guestblog")
            }
        })
    }
    else {
        model = {
            validationErrors,
            title,
            content,
            description,
            name
        }
        response.render("create-guestBlogpost.hbs", model)

    }


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

//POST UPDATE spec guest blogpost
router.post("/update-guestblog/:id", function (request, response) {
    const id = request.params.id
    const guest_title = request.body.title
    const guest_content = request.body.content
    const guest_description = request.body.description
    const guest_name = request.body.name

    const validationErrors = guestblogValidationErrorCheck(guest_title, guest_content, guest_description, guest_name)

    if (validationErrors == 0) {
        db.updateGuestblogpost(id, guest_title, guest_content, guest_description, guest_name, function (error) {
            if (error) {
                console.log(error)
            }
            else {
                response.redirect("/guestblog/" + id)
            }
        })
    }
    else {
        const guestblog = {guest_title, guest_content, guest_description, guest_name}
        model = {
            guestblog,
            validationErrors
        }
        response.render("update-guestblog.hbs", model)
    }


})

module.exports = router