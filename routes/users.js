// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
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