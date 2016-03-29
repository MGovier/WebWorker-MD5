'use strict';

/**
 * Main JS to coordinate WebWorkers and update DOM.
 * See worker.js for individual process function.
 */

var workers = [];

/**
 * Stop all running workers.
 */
function stopWorkers() {
  workers.forEach(function (worker) {
    return worker.terminate();
  });
}

function updateStatus(msgData) {
  var target = document.querySelector('#worker-' + msgData.id + '-body');
  if (msgData.type === 'update') {
    target.innerHTML = 'Checking ' + Math.round(msgData.content) + ' hashes per second...';
  } else if (msgData.type === 'cracked') {
    target.innerHTML += '<b>Solved!</b>';
    var t = document.createElement('div');
    t.classList.add('alert', 'alert-success');
    t.innerHTML = 'Hash matched: <b>' + msgData.content + '</b> ' + ('Time taken: ' + msgData.time + 'ms.');
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
  var workerCount = parseInt(document.querySelector('#workerCount').value, 10);
  var hash = document.querySelector('#hash').value;
  for (var i = 0; i < workerCount; ++i) {
    var child = new Worker('js/worker.js');
    workers.push(child);
    child.addEventListener('message', messageListener);

    var t = document.querySelector('#worker-window');
    t.content.querySelector('.panel-heading').textContent = 'Worker ' + i;
    t.content.querySelector('.panel-body').setAttribute('id', 'worker-' + i + '-body');
    var clone = document.importNode(t.content, true);
    document.body.querySelector('#workers').appendChild(clone);

    child.postMessage({ type: 'setWorkerId', content: i });
    child.postMessage({ type: 'setWorkerCount', content: workerCount });
    child.postMessage({ type: 'setHash', content: hash });
    child.postMessage({ type: 'start' });
  }
}

var parameters = document.getElementById('parameters');
parameters.addEventListener('submit', function (evt) {
  evt.preventDefault();
  start();
});