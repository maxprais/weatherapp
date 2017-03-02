const express = require('express');
const router = express.Router();
const Horseman = require('node-horseman');
const rp = require('request-promise');
const cheerio = require('cheerio');

const NewYorkWeather = 'https://www.wunderground.com/US/NY/New_York.html';
const LondonWeather = 'https://www.wunderground.com/gb/london/zmw:00000.1.03772';
const WeatherLocations = [NewYorkWeather, LondonWeather];

router.get('/', function(req, res, next) {
    let jsonResponse = [];
    let requests = [];

    WeatherLocations.forEach((location) => {
        requests.push(rp(location));
    });

    let isError = false;
    Promise.all(requests).then((results) => {
        results.forEach((html) => {
            let $ = cheerio.load(html);
            let weather = {
                city: $('.city-nav-header').text(),
                description: $('#curCond').text(),
                temperature: $('[data-variable="temperature"]').text(),
                humidity: $('[data-variable="humidity"]').first().find('.wx-value').text(),
                windspeed: $('[data-variable="wind_dir"] .not-variable').text(),
                icon: $('[data-variable="icon_url"]').attr('src'),
            };

            if (typeof weather.city !== 'undefined' && weather.city !== '') {
                jsonResponse.push(weather);
                isError = false;
            } else {
                isError = true;
            }
        });

        res.render('index', {
            weatherData: jsonResponse,
            isError: isError
        });
    });
});

router.post('/search', function(req, res) {
    let location = req.body.location;
    let horseman = new Horseman();

    horseman
        .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
        .open('http://www.google.com')
        .type('input[name="q"]', 'wunderground' + ' ' + location)
        .click('[name="btnK"]')
        .keyboardEvent('keypress', 16777221)
        .waitForSelector('div.g')
        .attribute('.r a', 'href')
        .then((link) => {
            WeatherLocations.push(link);
            res.redirect('/');
        });

});

module.exports = router;
