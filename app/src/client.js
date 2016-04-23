/**
 * Main JS to coordinate WebWorkers and update DOM.
 * See worker.js for individual process function.
 *
 * @author UP663652
 */

const workers = [];

/**
 * Stop all running workers.
 */
function stopWorkers() {
  workers.forEach(worker => worker.terminate());
}

/**
 * Update the current status of the worker, listing speed or success.
 * @param  {Object}   msgData   Data from the worker message.
 */
function updateStatus(msgData) {
  const target = document.querySelector(`#worker-${msgData.id}-body`);
  if (msgData.type === 'update') {
    // Update the value of current hashing speed.
    target.innerHTML = `Checking ${Math.round(msgData.content)} hashes per second...`;
  } else if (msgData.type === 'cracked') {
    // Otherwise, show which worker solved the hash.
    // Add a success notification too.
    target.innerHTML += '<b>Solved!</b>';
    const t = document.createElement('div');
    t.classList.add('alert', 'alert-success');
    t.innerHTML = `Hash matched: <b>${msgData.content}</b> ` +
      `Time taken: ${msgData.time}ms. All workers have been stopped.`;
    document.querySelector('#result').appendChild(t);
  }
}

/**
 * Listener for messages from workers.
 * @param  {Object}   msg   Worker message.
 */
function messageListener(msg) {
  switch (msg.data.type) {
    case 'cracked':
      console.log('Solved!', msg.data.content);
      // Stop all workers if the hash has been solved.
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

/**
 * Start the set number of workers trying to crack the provided hash.
 */
function start() {
  // Clean up old workers.
  stopWorkers();
  document.querySelector('#workers').innerHTML = '';
  document.querySelector('#result').innerHTML = '';
  // Find the number of workers and the hash set in the page.
  const workerCount = parseInt(document.querySelector('#workerCount').value, 10);
  const hash = document.querySelector('#hash').value;
  // For the set number, start up workers and UI elements.
  for (let i = 0; i < workerCount; ++i) {
    const child = new Worker('js/worker.js');
    workers.push(child);
    // Add a listener for the messages from the worker.
    child.addEventListener('message', messageListener);
    // Add interface elements to present progress.
    const t = document.querySelector('#worker-window');
    t.content.querySelector('.panel-heading').textContent = `Worker ${i}`;
    t.content.querySelector('.panel-body').setAttribute('id', `worker-${i}-body`);
    const clone = document.importNode(t.content, true);
    document.body.querySelector('#workers').appendChild(clone);
    // Send variables to the worker.
    child.postMessage({ type: 'setWorkerId', content: i });
    child.postMessage({ type: 'setWorkerCount', content: workerCount });
    child.postMessage({ type: 'setHash', content: hash });
    child.postMessage({ type: 'start' });
  }
}

// Listen to submit or return on the inputs and start.
const parameters = document.getElementById('parameters');
parameters.addEventListener('submit', evt => {
  evt.preventDefault();
  start();
});
