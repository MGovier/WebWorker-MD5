/**
 *
 * @author UP663652
 */
self.importScripts('md5.min.js');

let workerId = undefined;
let hash = undefined;
let workerCount = undefined;

const REPORT_RATE = 80000;

/**
 * Increment the string by the number of workers.
 * As the initial string is tied to the worker ID, this will keep the workers
 * synchronized.
 * @param  {String} attempt String to increment.
 * @return {String}         Result.
 */
function increment(attempt) {
  let ret = attempt;
  let lastChar = ret.substr(ret.length - 1).charCodeAt(0);
  let lastCharIncr = lastChar + workerCount;
  const firstCharIncr = lastCharIncr;
  // Start incrementing preceeding characters, or add one to end.
  let i = 1;
  while (lastCharIncr > 122) {
    if (++i > ret.length) {
      ret = String.fromCharCode(97).repeat(ret.length) +
        String.fromCharCode(97 + (firstCharIncr - 123));
      return ret;
    }
    lastChar = ret.substr(ret.length - i).charCodeAt(0);
    lastCharIncr = lastChar + 1;
  }
  ret = ret.substr(0, ret.length - i) + String.fromCharCode(lastCharIncr);
  if (i > 2) {
    ret += String.fromCharCode(97).repeat(i - 2);
  }
  if (i > 1) {
    ret += String.fromCharCode(97 + (firstCharIncr - 123));
  }
  return ret;
}

function start() {
  console.log(`Worker ${workerId} trying to guess ${hash}`);
  const startTime = new Date();
  // Start on first character, plus the number of this worker.
  let attempt = String.fromCharCode(97 + workerId);
  let tracker = 0;
  while (true) {
    attempt = increment(attempt);
    if (md5(attempt) === hash) {
      this.postMessage({
        type: 'cracked',
        content: attempt,
        id: workerId,
        time: (new Date() - startTime),
      });
      console.log(`${workerId} found ${attempt}`);
    }
    if (tracker % REPORT_RATE === 0) {
      this.postMessage({
        type: 'update',
        id: workerId,
        content: tracker / ((new Date() - startTime) / 1000),
      });
    }
    tracker++;
  }
}

this.addEventListener('message', msg => {
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
      this.postMessage({ type: 'log', contents: 'Unrecognised command' });
  }
});
