# Parallel Web
Repository for Distributed and Parallel Programming 2016 at University of Portsmouth.
[See the demo!](https://mgovier.github.io/WebWorker-MD5/)

## Purpose
Calculate MD5 hashes in an attempt to find the string that generated that hash, through brute-force.

## Technologies
* [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
* [JS Spark MD5](https://github.com/satazor/js-spark-md5)

## About
To start this up locally:
* Install [Node.JS](https://nodejs.org/en/) if necessary.
* Download this repository, and `cd` into the folder from your terminal.
* Run `npm install` to grab the dependencies.
* Run `npm start`, and browse to `http://localhost:1337` by default.

The main logic is located in `app/src`. This is written using ES6, so babel is used for browser compatibility. Run `npm run build` to re-generate the files in `app/public/js/`, which are the ones served to the client.
