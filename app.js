//jshint esversion:6
const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//get index.html file( essentially the initial landing page.)
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/style.css", function (req, res) {
    res.sendFile(__dirname + "/style.css");
});
// ETC to any of the currencies are not supported by api currently.
// BTC to GDP not supported by api. 
// LTC to GSP not supported by api.
app.post("/", function (req, res) {
    var crypto = req.body.crypto;
    var fiat = req.body.fiat;

    var baseURL = "https://apiv2.bitcoinaverage.com/indices/global/ticker/";
    var finalURL = baseURL + crypto + fiat;

    request(finalURL, function (err, response, body) {
        var data = JSON.parse(body);
        var price = data.last;

        var currDate = data.display_timestamp;
        res.write("<p>The current date is " + currDate + "</p>");
        res.write("<h1>The current price of " + crypto + " is " + price + " " + fiat + "</h1>");
        res.send();
    });

});

// implementing the other way around, but there's no api that supports it this way. 
// just a working example to practice writing in node/express
app.post("/crypto-to-fiat", function (req, res) {
    var crypto2 = req.body.crypto2;
    var fiat2 = req.body.fiat2;
    var userAmount = req.body.amount;

    var options = {
        url: "https://apiv2.bitcoinaverage.com/convert/global",
        method: "GET",
        qs: {
            from: crypto2, 
            to: fiat2,
            amount: userAmount,
        }
    };

    request(options, function (err, response, body) {
        var data = JSON.parse(body);
        var price = data.price;

        var currDate = data.time;
        res.write("<p>The current date is " + currDate + "</p>");
        res.write("<h1>The current price of " + userAmount + " " + crypto2 + " is " + price + " " + fiat2 + "</h1>");
        res.send();
    });
})

app.listen(3000, function () {
    console.log("Server running on port 3000");
});