
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
const username = "username"
const password = "123"


app.use(express.static(__dirname + "/public"))

app.use(bodyParser.urlencoded({
    extended: false
}))
app.engine("hbs", expressHandlebars({
    defaultLayout: 'main.hbs'
}))


app.use('/blogs', blogRouter)
app.use("/guestblog", guestBlogRouter)
app.use("/portfolio", portfolioRouter)



app.get('/', function (request, response) {
    response.render('home.hbs')
})

app.get('/about', function (request, response) {
    response.render('about.hbs')
})

app.get('/contact', function (request, response) {
    response.render('contact.hbs')
})


app.listen(8080)