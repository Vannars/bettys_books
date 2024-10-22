// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const {redirectLogin} = require('./redirectlogin') // make a cheeky redirectLogin function from the imported redirectlogin.js file
const { check, validationResult} = require('express-validator');

router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

// New route to handle login
router.get('/login', function (req, res, next) {
    // Render the login.ejs view
    res.render('login.ejs')                                                               
})
// router to handle post request for login
router.post('/loggedin', 
    check ('username').isAlphanumeric(), // check the username is alphanumeric
    check ('password').isLength({min: 8}), // min password length is 8
    function (req, res, next) {
        const errors = validaitonResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./login');
    } else{
    // Query the database to get the hashed password from the users table
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?"
    // Execute the SQL query taking the username from the request body
    db.query(sqlquery, [sanitizedUsername], function(err, result) {
        // Simple error handling
        if (err) return next(err);
        // If no results are returned, the user is not found
        if (result.length == 0) {
            res.send('user not found');
        } else {
            // use bcrypt taking the body password and the password from the result (index 0) from the query
            bcrypt.compare(req.body.password, result[0].hashedPassword, function(err, result) {
                // conditional output based on the result of the comparison
                if (err) {
                    res.send ('Login failed');
                } else if (result) {
                    req.session.userId = sanitizedUsername;
                    res.redirect('/');
                } else {
                    res.send('Login failed');
                }
            });
        }
    });                                                             
}});

// router to handle logout
router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'/'+'>Home</a>');
    })
})



router.get('/list', redirectLogin, function(req, res, next){
    let sqlquery = "SELECT * FROM users" // query database to get all the users
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        
        res.render("userlist.ejs", {availableUsers:result})
     })
})
// check: email is an email, password has at least 8 characters, first and last name a-z/A-Z, username is alphanumeric a-z/A-Z/0-9
// errors cause a redirect to the register page
router.post('/registered', [check('email').isEmail(), 
     check('password').isLength({min:8})], 

    function (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.redirect('./register')
    } else {
    const saltRounds = 10;
    // constants to sanitize the input
    const plainPassword = req.body.password
    const sanitizedFirst = req.sanitize(req.body.first);
    const sanitizedLast = req.sanitize(req.bodylast);
    const sanitizedEmail = req.sanitize(req.body.email);
    const sanitizedUsername = req.sanitize(req.body.username);

     // Hash the password
     bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            console.error(err);
            return next(err);
        }

        console.log('Hashed Password:', hashedPassword);

        // Store hashed password in your database.
        let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";

        // Execute SQL query
        db.query(sqlquery, [sanitizedUsername, sanitizedFirst, sanitizedLast, sanitizedEmail, hashedPassword], function(err, result) {
            if (err) return next(err);
            console.log("1 record inserted");
            // Send a response
            result = 'Hello ' + sanitizedFirst + ' ' + sanitizedLast + ' you are now registered! We will send an email to you at ' + sanitizedEmail;
            result += ' Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword;
            res.send(result);
        });
     });
    };    
});

// Export the router object so index.js can access it
module.exports = router