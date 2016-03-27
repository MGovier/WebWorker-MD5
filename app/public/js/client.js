const workers = [];

function start() {
  const workerCount = document.getElementById('workerCount').value;
  const hash = document.getElementById('hash').value;
  for (let i = 0; i < workerCount; ++i) {
    const child = new Worker('js/worker.js');
    workers.push(child);
    child.postMessage({ type: 'setWorkerId', content: i });
    child.postMessage({ type: 'setHash', content: hash });
    child.postMessage({ type: 'start' });
  }
}

const parameters = document.getElementById('parameters');
parameters.addEventListener('submit', evt => {
  evt.preventDefault();
  start();
});
