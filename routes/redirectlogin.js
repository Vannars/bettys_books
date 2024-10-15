const redirectLogin = (req, res, next) => { /// just a cheeky shorthand function to check if the user is logged in
    if (!req.session.userId) { // if not (by session id)
        res.redirect('/users/login'); // redirect to login page
    } else {
        next(); // move to the next middleware function
    }
};

module.exports = { // remember to export and import before using the function
    redirectLogin
};