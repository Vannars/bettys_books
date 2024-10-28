// Create a new router
const express = require("express") // require the express module
const router = express.Router()  // create a new router object
const {redirectLogin} = require('./redirectlogin') // make a cheeky redirectLogin function from the imported redirectlogin.js file
const request = require("request"); // require the request module

// Handle our routes
router.get('/', function(req, res, next){
    res.render('index.ejs')
})

router.get('/about', function(req, res, next){
    
    res.render('about.ejs')
})

router.get('/weather', function(req, res, next){
    res.render('weather.ejs')
})
// Route to get weather data
router.get('/londonnow', (req, res, next) => {
    // User activates get route in the weather.ejs file
    // API key, city and URL - url parses key and city into its own string       
     let city = req.query.search_text; // Query from weather.ejs is used for city (search query from the weather.ejs page)
    let apiKey = '93ba31901386c85d2efea1fca67e2d59';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    // Request the data from the API using the URL
    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            //Define Js object with the parsed JSON data
              var weather = JSON.parse(body);
            // If the weather object is not undefined and the main object is not undefined
              if(weather!==undefined && weather.main!==undefined) {
                // Render weather_result.ejs - include the followng JSON data as variables
                res.render('weather_result.ejs', {
                     region: weather.sys.country,
                     city: weather.name, 
                     temperature: weather.main.temp, 
                     feels_like: + weather.main.feels_like, 
                     humidity: weather.main.humidity,  
                     description: weather.weather[0].description
                     //^^These will be used in weather_result.ejs^^
              }); 
              //Error handle for no results found (e.g cities that do not exist)
            } else {
                res.send('No results found for: ' + req.query.search_text);
              };
        };
    });
});

// Export the router object so index.js can access it
module.exports = router