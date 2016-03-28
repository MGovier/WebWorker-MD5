let workerId = undefined;
let hash = undefined;
let workerCount = undefined;
let running = true;

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
  console.log(`Worker ${workerId} trying to crack ${hash}`);
  // Start on first character, plus the number of this worker.
  let attempt = String.fromCharCode(97 + workerId);
  for (let i = 0; i < 500; ++i) {
    attempt = increment(attempt);
    console.log(attempt);
    if (attempt === 'tea') {
      console.log(`${workerId} found ${attempt} correctly`);
    }
    if (i === 499999) {
      console.log(`${workerId} ended on ${attempt}`);
    }
  }
  console.log('worker finished');
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

    case 'stop':
      running = false;
      break;

    default:
      this.postMessage({ type: 'log', contents: 'Unrecognised command' });
  }
});
