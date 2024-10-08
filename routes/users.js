// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

// New route to handle login
router.get('/login', function (req, res, next) {
    // Render the login.ejs view
    res.render('login.ejs')                                                               
})
// router to handle post request for login
router.post('/loggedin', function (req, res, next) {
    // Query the database to get the hashed password from the users table
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?"
    // Execute the SQL query taking the username from the request body
    db.query(sqlquery, [req.body.username], function(err, result) {
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
                    res.send('Login successful');
                } else {
                    res.send('Login failed');
                }
            });
        }
    });                                                             
});

router.get('/list', function(req, res, next){
    let sqlquery = "SELECT * FROM users" // query database to get all the users
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        
        res.render("userlist.ejs", {availableUsers:result})
     })
})

router.post('/registered', function (req, res, next) {
    const saltRounds = 10;
    const plainPassword = req.body.password

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
        db.query(sqlquery, [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword], function(err, result) {
            if (err) return next(err);
            console.log("1 record inserted");
            // Send a response
            result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We will send an email to you at ' + req.body.email;
            result += ' Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword;
            res.send(result);
        });
     });
    
});

// Export the router object so index.js can access it
module.exports = router