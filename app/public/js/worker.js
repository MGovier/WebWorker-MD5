'use strict';

/**
 * Individual worker functionality.
 * Controlled by, and communicates with client.js.
 *
 * @author UP663652
 */

// Uses the SparkMD5 hashing library from https://github.com/satazor/js-spark-md5
// Written by André Cruz 2016.
self.importScripts('spark-md5.min.js');

// Variables that will be set by messages when worker created.
var workerId = undefined;
var hash = undefined;
var workerCount = undefined;

// How often to update the main thread on current speed.
var REPORT_RATE = 80000;

/**
 * Increment the string by the number of workers.
 * As the initial string is tied to the worker ID, this will keep the workers
 * synchronized.
 * @param  {String}   attempt       String to increment.
 * @return {String}   nextAttempt   Result.
 */
function increment(attempt) {
  var nextAttempt = attempt;
  var lastChar = nextAttempt.substr(nextAttempt.length - 1).charCodeAt(0);
  var lastCharIncr = lastChar + workerCount;
  var firstCharIncr = lastCharIncr;
  // Start incrementing preceeding characters, or add one to end.
  var i = 1;
  while (lastCharIncr > 122) {
    if (++i > nextAttempt.length) {
      nextAttempt = String.fromCharCode(97).repeat(nextAttempt.length) + String.fromCharCode(97 + (firstCharIncr - 123));
      return nextAttempt;
    }
    lastChar = nextAttempt.substr(nextAttempt.length - i).charCodeAt(0);
    lastCharIncr = lastChar + 1;
  }
  nextAttempt = nextAttempt.substr(0, nextAttempt.length - i) + String.fromCharCode(lastCharIncr);
  if (i > 2) {
    nextAttempt += String.fromCharCode(97).repeat(i - 2);
  }
  if (i > 1) {
    nextAttempt += String.fromCharCode(97 + (firstCharIncr - 123));
  }
  return nextAttempt;
}

/**
 * Start guessing at strings.
 */
function start() {
  console.log('Worker ' + workerId + ' trying to guess ' + hash);
  // Set start time for calculating speed.
  var startTime = new Date();
  // Start on 'a' character, plus the number of this worker.
  var attempt = String.fromCharCode(97 + workerId);
  // Tracker records the number of guesses made so far, for speed calculation.
  var tracker = 0;
  // Run until the worker is terminated.
  while (true) {
    if (SparkMD5.hash(attempt) === hash) {
      // The guess matched! Tell the main script.
      self.postMessage({
        type: 'cracked',
        content: attempt,
        id: workerId,
        time: new Date() - startTime
      });
      console.log(workerId + ' found ' + attempt);
    }
    if (tracker % REPORT_RATE === 0) {
      self.postMessage({
        type: 'update',
        id: workerId,
        content: tracker / ((new Date() - startTime) / 1000)
      });
    }
    // Get next guess and increment count of guesses.
    attempt = increment(attempt);
    tracker++;
  }
}

/**
 * Listen to messages from the main script.
 * @param {Object}    message   Message object from client.js.
 */
self.addEventListener('message', function (msg) {
  switch (msg.data.type) {
    case 'setWorkerId':
      workerId = msg.data.content;
      break;

    case 'setHash':
      hash = msg.data.content;
      break;

    case 'setWorkerCount':
      workerCount = msg.data.content;
      break;

    case 'start':
      start();
      break;

    default:
      self.postMessage({ type: 'log', contents: 'Unrecognised command' });
  }
});