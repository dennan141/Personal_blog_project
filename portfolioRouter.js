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


module.exports = router