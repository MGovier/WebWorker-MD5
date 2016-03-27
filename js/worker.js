let workerId = null;
let hash = null;

function nextChar(c) {
  let char = c.charCodeAt(0) + 1;
  if (char > 122) {
    char = 48;
  }
  return String.fromCharCode(char);
}

function start() {
  console.log(`Worker ${workerId} trying to crack ${hash}`);
}

this.addEventListener('message', msg => {
  console.log(msg);
  switch (msg.data.type) {
    case 'setWorkerId':
      workerId = msg.data.content;
      break;

    case 'setHash':
      hash = msg.data.content;
      break;

    case 'start':
      start();
      break;

    default:
      this.postMessage({ type: 'log', contents: 'Unrecognised command' });
  }
});
