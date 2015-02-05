# url-shortener

An URL shortener utilizing [Express 4](http://expressjs.com/)

## Usage

This application has the following interface:

**POST /shorten**
+ Parameter: URL encoded parameter _link_ should contain an URL that should be shortened
+ Returns: ID for shortened link in plain text

**GET /{id}**
+ Returns: Redirects the user to the stored URL in case the ID is valid

## About

This application is based on [a barebones Node.js app](https://github.com/heroku/node-js-getting-started) by Heroku.