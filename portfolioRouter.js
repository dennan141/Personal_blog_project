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
function projectValidationErrorCheck(title, content, description) {
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


//GET whole portfolio
router.get('/', function (request, response) {
    db.getAllProjects(function (error, portfolio) {
        if (error) {
            console.log(error);
        } else {
            const model = {
                portfolio
            }
            response.render('portfolio.hbs', model)
        }
    })
})

//GET UPDATE project
router.get("/update-project/:id", function (request, response) {
    const id = request.params.id

    db.getProjectById(id, function (error, project) {
        if (error) {
            //Do something
            console.log(error)
        }
        else {
            const model = {
                project,
                validationErrors: []
            }
            response.render("update-project.hbs", model)
        }
    })
})

//GET CREATE project
router.get("/create-project", function (request, response) {
    response.render("create-project.hbs")
})


//GET spec project
router.get('/:id', function (request, response) {
    const id = request.params.id

    const blog = db.getProjectById(id, function (error, portfolio) {
        if (error) {
            //Do something
        }
        else {
            const model = {
                portfolio
            }
            response.render("project.hbs", model)
        }
    })
})


//POST CREATE new project
router.post("/create-project", function (request, response) {
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description

    db.createNewProject(title, content, description, function (error) {
        if (error) {
            //Do something
            console.log(error)
        }
        else {
            response.redirect("/portfolio")
        }
    })

})

//POST DELETE spec project
router.post("/delete-project/:id", function (request, response) {
    const id = request.params.id

    db.deleteProject(id, function (error) {
        if (error) {
            console.log(error)
        }
        else {
            response.redirect("/portfolio")
        }
    })
})

//POST UPDATE spec project
router.post("/update-project/:id", function (request, response) {
    const id = request.params.id
    const title = request.body.title
    const content = request.body.content
    const description = request.body.description

    const validationErrors = projectValidationErrorCheck(title, content, description)

    if (validationErrors == 0) {
        db.updateProject(id, title, content, description, function (error) {
            if (error) {

                console.log(error)
            }
            else {
                response.redirect("/portfolio/" + id)
            }
        })
    }
    else {
        const project = { title, content, description }
        model = {
            validationErrors,
            project
        }
        response.render("update-project.hbs", model)
    }


})



module.exports = router