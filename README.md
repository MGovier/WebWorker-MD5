# Parallel Web
Repository for Distributed and Parallel Programming 2016 at University of Portsmouth.
[See the demo!](https://mgovier.github.io/WebWorker-MD5/)

## Purpose
Calculate MD5 hashes in an attempt to find the string that generated that hash, through brute-force.

## Technologies
* [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
* [JS Spark MD5](https://github.com/satazor/js-spark-md5)

## About
The main functionality is located in `app/src`. This is written using ES6, so babel is used to transpile for browser compatibility. Run `npm run build` to re-generate the files in `app/public/js/`, which are served to the client.

Linting with ESLint using Airbnb's guide. Run `npm run lint` to check JS `src` files.
