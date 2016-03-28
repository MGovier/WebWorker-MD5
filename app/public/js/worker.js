let workerId = undefined;
let hash = undefined;
let workerCount = undefined;
let running = true;

function increment(attempt) {
  let ret = attempt;
  let lastChar = ret.substr(ret.length - 1).charCodeAt(0);
  let lastCharIncr = lastChar + workerCount;
  // Start incrementing preceeding characters, or add one to end.
  let i = 1;
  while (lastCharIncr > 122) {
    //console.log('rollover!', ret);
    if (++i > ret.length) {
      ret = String.fromCharCode(97).repeat(ret.length + 1);
      //console.log('ret2', ret);
      return ret;
    }
    lastChar = ret.substr(ret.length - i).charCodeAt(0);
    lastCharIncr = lastChar + workerCount;
  }
  ret = ret.substr(0, ret.length - i) + String.fromCharCode(lastCharIncr) +
    String.fromCharCode(97).repeat(i - 1);
  //console.log('ret', ret);
  return ret;
}

function start() {
  console.log(`Worker ${workerId} trying to crack ${hash}`);
  // Start on first character, plus the number of this worker.
  let attempt = String.fromCharCode(97 + workerId);
  for (let i = 0; i < 50000; ++i) {
    attempt = increment(attempt);
    if (attempt === 'tea') {
      console.log('wow');
    }
    if (i === 49999) {
      console.log(attempt);
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
