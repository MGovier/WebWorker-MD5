/**
 * Main JS to coordinate WebWorkers and update DOM.
 * See worker.js for individual process function.
 */

const workers = [];

/**
 * Stop all running workers.
 */
function stopWorkers() {
  workers.forEach(worker => worker.terminate());
}

function updateStatus(msgData) {
  const target = document.querySelector(`#worker-${msgData.id}-body`);
  if (msgData.type === 'update') {
    target.innerHTML = `Checking ${Math.round(msgData.content)} hashes per second...`;
  } else if (msgData.type === 'cracked') {
    target.innerHTML += '<b>Solved!</b>';
    const t = document.createElement('div');
    t.classList.add('alert', 'alert-success');
    t.innerHTML = `Hash matched: <b>${msgData.content}</b> ` +
      `Time taken: ${msgData.time}ms.`;
    document.querySelector('#result').appendChild(t);
  }
}

function messageListener(msg) {
  switch (msg.data.type) {
    case 'cracked':
      console.log('Solved!', msg.data.content);
      stopWorkers();
      updateStatus(msg.data);
      break;
    case 'update':
      updateStatus(msg.data);
      break;
    default:
      console.log('Worker message not recognised.');
  }
}

function start() {
  // Clean up old workers.
  stopWorkers();
  document.querySelector('#workers').innerHTML = '';
  document.querySelector('#result').innerHTML = '';
  const workerCount = parseInt(document.querySelector('#workerCount').value, 10);
  const hash = document.querySelector('#hash').value;
  for (let i = 0; i < workerCount; ++i) {
    const child = new Worker('js/worker.js');
    workers.push(child);
    child.addEventListener('message', messageListener);

    const t = document.querySelector('#worker-window');
    t.content.querySelector('.panel-heading').textContent = `Worker ${i}`;
    t.content.querySelector('.panel-body').setAttribute('id', `worker-${i}-body`);
    const clone = document.importNode(t.content, true);
    document.body.querySelector('#workers').appendChild(clone);

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
