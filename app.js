const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express(); //creates an app that runs on node express 

app.use(express.static("public")); //calls the folder to use the CSS file for styling 
app.use(bodyParser.urlencoded({extended: true})); //calls the bodyparser module to use for the form 
app.set("view engine", "ejs"); //calls the EJS module to use a template 

app.get("/", function(req, res) { //creates a page response 
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) { //takes data from the "form" on the index, which MUST have a "post" method and an action which matches the path (in this case "/") 
    var cityName = req.body.cityName; //takes the city name from the form and assigns a variable name to it 
    console.log(cityName); //logs the name of the city 
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=25e2ac3cc94d22c5609b46e5a8ebdf7f&units=metric" //calls the API with the specific queries 
    https.get(url, function(response) { //gets the data from the API using the URL 
        console.log(response.statusCode); //logs the status to see if the call was successful 
        response.on("data", function(data) { //
            const weatherData = JSON.parse(data); //creates a JSON file out of the data referring to the specific city 
            const temperature = weatherData.main.temp; //reads the JSON file and extracts a specific piece from it 
            //one way to know how to call specific parts of the JSON file is to log it on to the console and see how it is structured 
            const description = weatherData.weather[0].description; //reads the JSON file and extracts a specific piece from it 
            const icon = weatherData.weather[0].icon; //reads the JSON file and extracts a specific piece from it 
            const imageURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png"; //defines a variable URL based on the JSON file 
            res.render("result", {temperatureText: temperature, descriptionText: description, imagesource: imageURL}); //renders the viewer using the specified variables 
            res.send();
        })
    })
})

app.listen(3000, function() {
    console.log("This server is running on port 3000.");
})