// Import express, ejs, express-validator, express-sanitizer, mysql, express-session 
var express = require ('express');
var ejs = require('ejs');
var validator = require ('express-validator');
const expressSanitizer = require('express-sanitizer');

//Import mysql module
var mysql = require('mysql2');

//Import express-session module
var session = require('express-session');
const {redirectLogin} = require('./routes/redirectlogin')

// Create the express application object
const app = express();
const port = 8000;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');
// Set up the body parser 
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'));
// Set up the express-sanitizer
app.use(expressSanitizer());

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'bettys_books_app',
    password: 'qwertyuiop',
    database: 'bettys_books'
})
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
})
global.db = db

// Create session 
// the secret paramater is used to create a session is (sign the cookie id with this secret)
app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Define our application-specific data
app.locals.shopData = {shopName: "Bettys Books"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', booksRoutes)

const apiRoutes = require ('./routes/api')
app.use('/api', apiRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))