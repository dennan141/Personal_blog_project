const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("database.db")

db.run(`
        CREATE TABLE IF NOT EXISTS guestblogposts(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guest_title TEXT,
                guest_content TEXT,
                guest_description TEXT,
                guest_name TEXT
        )

`)

db.run(`
        CREATE TABLE IF NOT EXISTS blogposts(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT,
                description TEXT
        )

`)

db.run(`
        CREATE TABLE IF NOT EXISTS portfolio(
                projId INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT,
                description TEXT
        )
`)

//Blog
exports.getAllBlogs = function (callback) {
        const query = "SELECT * from blogposts ORDER BY id DESC"

        db.all(query, function (error, blogposts) {
                callback(error, blogposts)
        })
}

exports.getBlogById = function (id, callback) {
        const query = "SELECT * FROM blogposts WHERE id = ?"
        const values = [id]

        db.get(query, values, function (error, blogposts) {
                callback(error, blogposts)
        })
}

exports.createNewBlogpost = function(title,content, description, callback){
        const query = "INSERT INTO blogposts (title, content, description) VALUES (?,?,?)"
        const values = [title, content, description]

        db.run(query, values, function(error){
                callback(error)
        })
}

exports.deleteBlogpost = function(id, callback){
        const query = "DELETE FROM blogposts WHERE id = ?"
        const values = [id]

        db.run(query,values,function(error){
                callback(error)
        })
}


//Portfolio
exports.getAllProjects = function (callback) {
        const query = "SELECT * from portfolio"

        db.all(query, function (error, portfolio) {
                callback(error, portfolio)
        })
}


exports.getProjectById = function (id, callback) {
        const query = "SELECT * FROM portfolio WHERE id = ?"
        const values = [id]

        db.get(query, values, function (error, portfolio) {
                callback(error, portfolio)
        })
}

//Guest blogs
exports.getAllGuestBlogs = function (callback) {
        const query = "SELECT * from guestblogposts"

        db.all(query, function (error, guestblogposts) {
                callback(error, guestblogposts)
        })
}

exports.getGuestBlogById = function (id, callback) {
        const query = "SELECT * FROM guestblogposts WHERE id = ?"
        const values = [id]

        db.get(query, values, function (error, guestblogposts) {
                callback(error, guestblogposts)
        })
}