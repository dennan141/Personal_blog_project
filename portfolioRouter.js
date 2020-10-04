const express = require('express')
const db = require("./db")
const router = express.Router();
const bodyParser = require('body-parser')

router.use(express.static(__dirname + "/public"))
router.use(bodyParser.urlencoded({
    extended: false
}))


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


module.exports = router