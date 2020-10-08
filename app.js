
const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)


const guestBlogRouter = require("./guest-blogRouter")
const blogRouter = require("./blogRouter")
const portfolioRouter = require("./portfolioRouter")

const app = express()
const adminUsername = "admin"
const adminPassword = "123"

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


//-----------------------

app.use('/blogs', blogRouter)
app.use("/guestblog", guestBlogRouter)
app.use("/portfolio", portfolioRouter)
app.use(function(request, response, next){
    const isLoggedIn = request.session.isLoggedIn
    response.locals.isLoggedIn = isLoggedIn
    next()
})


app.get('/', function (request, response) {

    const isLoggedIn = request.session.isLoggedIn

    const model = {
        isLoggedIn
    }
    response.render('home.hbs',model)
})

app.get('/about', function (request, response) {
    response.render('about.hbs')
})

app.get('/contact', function (request, response) {
    response.render('contact.hbs')
})

app.get("/login", function(request, response){
response.render("login.hbs")
})

app.post("/login", function(request, response){
    const enteredUsername = request.body.username
    const enteredPassword = request.body.password

    if (enteredUsername == adminUsername && enteredPassword == adminPassword) {
        request.session.isLoggedIn = true
        response.redirect("/")
    }
    else{
        //Display error message same as validation error i think
        response.redirect("/blogs")
    }

})

app.post("/logout", function (request, response){
    request.session.isLoggedIn = false
    //BETTER WAY TO DISPLAY LOG OUT?
    response.redirect("/")
})


app.listen(8080)