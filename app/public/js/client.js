const workers = [];

function start() {
  const workerCount = parseInt(document.getElementById('workerCount').value, 10);
  const hash = document.getElementById('hash').value;
  for (let i = 0; i < workerCount; ++i) {
    const child = new Worker('js/worker.js');
    workers.push(child);
    child.postMessage({ type: 'setWorkerId', content: i });
    child.postMessage({ type: 'setWorkerCount', content: workerCount });
    child.postMessage({ type: 'setHash', content: hash });
    child.postMessage({ type: 'start' });
  }
}

const parameters = document.getElementById('parameters');
parameters.addEventListener('submit', evt => {
  evt.preventDefault();
  start();
});
