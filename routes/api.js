const express = require("express");
const router = express.Router();

// ORIGINAL CODE
// router.get('/books', function (req, res, next) {

//     // Query database to get all the books
//     let sqlquery = "SELECT * FROM books"

//     // Execute the sql query
//     db.query(sqlquery, (err, result) => {
//         // Return results as a JSON object
//         if (err) {
//             res.json(err)
//             next(err)
//         }
//         else {
//             res.json(result)
//         }
//     })
// })

// UPDATED CODE- allows for search term to be passed in the URL - allows for a partial match on searchTerm and returns all books if nothing is passed
router.get("/books/:search_term?", function (req, res, next) {
  // Defining my queries, search pattern and  search term
  let searchTerm = req.params.search_term; // Take the search term from the URL
  let searchPattern = `%${searchTerm}%`; // allow partial match using % wildcard
  let allBooksQuery = "SELECT * FROM books"; // selects all books
  let searchBooksQuery = "SELECT * FROM books WHERE name LIKE ?"; // Returns all books containing the search term

  // If searchTerm is not used, return all books
  if (!searchTerm) {
    db.query(allBooksQuery, (err, result) => {
      if (err) {
        // Error handling
        res.json(err);
        next(err);
      } else {
        res.json(result);
      }
    });
  } else {
    // If the searchTerm is used, return the books with titles containing or related to the searchTerm using searchPattern
    db.query(searchBooksQuery, [searchPattern], (err, result) => {
      if (err) {
        // Error handling
        res.json(err);
        next(err);
      } else {
        // If no results are found, return all books
        if (result.length === 0) {
          db.query(allBooksQuery, (err, result) => {
            if (err) {
              // Error handling
              res.json(err);
              next(err);
            } else {
              res.json(result);
            }
          });
          //Otherwise, return the result/s
        } else {
          res.json(result);
        }
      }
    });
  }
});

module.exports = router; // export the router object so index.js can access it
