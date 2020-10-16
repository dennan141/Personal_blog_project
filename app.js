
const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const bcrypt = require("bcrypt")
//------------------------
const guestBlogRouter = require("./guest-blogRouter")
const blogRouter = require("./blogRouter")
const portfolioRouter = require("./portfolioRouter")


//USERNAME AND PASSWORD: Password is left un-hashed below to makes it more convenient for Peter.
//the below const "adminPassword will not be stored here after i've passed the course"
const app = express()
const adminUsername = "admin"
const adminPassword = "123"
const hashedPassword = "$2b$10$LsSSRrmcE5j4BHhUhEjcj.Y9AI0WKoLVDLQ5wLydkb270dT6MzxdO"


app.use(expressSession({
    secret: "asdfghjkl",
    saveUninitialized: false,
    resave: false
}))
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.engine("hbs", expressHandlebars({
    defaultLayout: 'main.hbs'
}))

//---------------------------------
function loginErrorCheck(enteredUsername, result) {
    const loginErrors = []

    if (enteredUsername != adminUsername) {
        loginErrors.push("Wrong username, please try again!")
    }
    if(!result){
        loginErrors.push("Wrong password, please try again!")
    }
    return loginErrors
}

app.use('/blogs', blogRouter)
app.use("/guestblog", guestBlogRouter)
app.use("/portfolio", portfolioRouter)
app.use(function (request, response, next) {
    const isLoggedIn = request.session.isLoggedIn
    response.locals.isLoggedIn = isLoggedIn
    next()
})

//GET home page
app.get('/', function (request, response) {

    const isLoggedIn = request.session.isLoggedIn

    const model = {
        isLoggedIn
    }
    response.render('home.hbs', model)
})

//GET about page
app.get('/about', function (request, response) {
    response.render('about.hbs')
})

//GET contact page
app.get('/contact', function (request, response) {
    response.render('contact.hbs')
})

//GET login page
app.get("/login", function (request, response) {
    response.render("login.hbs")
})

//POST login to session
app.post("/login", function (request, response) {
    const enteredUsername = request.body.username
    const enteredPassword = request.body.password

    bcrypt.compare(enteredPassword, hashedPassword, function (error, result) {

       loginErrors = loginErrorCheck(enteredUsername,result)

        if (loginErrors == 0) {
            request.session.isLoggedIn = true
            response.redirect("/")
        }
        else {
            model = {
                loginErrors,
                enteredUsername
            }
            response.render("./login.hbs", model)
        }
    })
})

//POST logout from session
app.post("/logout", function (request, response) {
    request.session.isLoggedIn = false
    //BETTER WAY TO DISPLAY LOG OUT?
    response.redirect("/")
})



app.listen(8080)