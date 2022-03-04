/*
Create a Weather Web Application Server Side and using API to request weather data
from https://openweathermap.org 

-include npm --> npm init

-install express framework --> npm install express

-install body-parse --> npm install body-parser

-run server with --> nodemon app.js  --> on web browser type "localhost:3000"
*/

const express = require("express");
const app = express(); 

//allowing to get the data sent "POST" from client side through <form></form>
const bodyParser = require("body-parser"); 

//body-parser can be used with express
//urlencoded is to grab information or data from <form></form> 
//extended: true allows to POST nested objects
app.use(bodyParser.urlencoded({extended: true})); 

//when sendFile/render... response also include CSS, images, or other assets in your "public" folder 
app.use(express.static("public")); 

//for get API request on weather data 
const https = require("https");

//create server listening at port 3000 
app.listen(3000, function(){
    console.log("Server up and running ... Listening at port 3000"); 
});

//process get request from client when access homepage
app.get("/", function(request, response){

    //ONLY can have one send 
    //response.send("Hello from Server!"); 

    //send the html file to client to render 
    response.sendFile(__dirname + "/index.html"); 
});


//get the post input or data from client <form></form> and reponse with weather data
app.post("/", function(request, response){
    
    //get the user input from <form></form>
    //console.log(request.body.cityName); 

    //API link to get the weather data from another server 
    const apiKey = "&appid=00ede88d1a02155923b5767080a007f1";
    const cityQuery = request.body.cityName;
    const metric = "&units=metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}${metric}${apiKey}`

    //request to GET the weather data from eternal server at https://openweathermap.org 
    https.get(url, function(res){

        //to get HTTP response status code (200 is "OK" meaning we got the data) check code status --> https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        //console.log(res.statusCode); 

        //access the weather data got from the API request 
        res.on("data", function(data){

            //parse data into JSON object 
            const weatherData = JSON.parse(data); 

            //see the JSON data 
            //console.log(weatherData);

            //you can use the Google chrome extension "JSON Viewer Pro" to copy the path to the data you want
            const temperature = weatherData.main.temp; 
            const temperatureMin = weatherData.main.temp_min;
            const temperatureMax = weatherData.main.temp_max;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon; 
            const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            //write data
            response.write('<!DOCTYPE html>'); 
            response.write('<html lang="en">');
            response.write('<head> <meta charset="UTF-8"> <title>Weather App</title>');
            response.write('<link rel="stylesheet" href="css/styles.css" />');
            response.write('</head>'); 
            response.write('<body>');
            response.write('<div>'); 
            response.write(`<h1>The current temperature in ${cityQuery} is ${temperature} degree Celcius.</h1>`);
            response.write(`<p class="weatherResult">The temperature range is ${temperatureMin} - ${temperatureMax}.</p> <br>`);
            response.write(`<img class="weathericon" src="${imageURL}" alt="weather icon"> <br>`);
            response.write(`<p class="weatherResult">The weather is currently ${weatherDescription}.</p>`); 
            response.write('</div>'); 
            response.write('<footer> <p>Copyright @ Krittidet Liu</p> </footer>'); 
            response.write('</body>');
            response.write('</html>');

            //send the written data to client
            response.send(); 

            //OR simply using send(); 
            //response.send(`The temperature in Bangkok is ${temperature} degree Celcius. The range temperature is ${temperatureMin} - ${temperatureMax}. <br> The weather in Bangkok is ${weatherDescription}.`); 
        });
    });
});


