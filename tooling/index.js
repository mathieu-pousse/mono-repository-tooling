const express = require('express')
const app = express()
const fetch = require('node-fetch');
var fs = require('fs');

var authorizations;
fs.readFile('../authorizations.json', 'utf8', function (err, data) {
  if (err) throw err;
  authorizations = JSON.parse(data);
});

app.use(express.json());

app.get('/', function (req, res) {
  console.log(req)
  res.send('for sanity!')
})

app.post('/tracker', function (req, res) {
  console.log('\n\n\n\n')
  console.log(req.headers['x-github-event'])
  console.log(req.body)
  res.send(':ok_hand:')
  switch (req.headers['x-github-event']) {
    case 'pull_request':
      handlePullRequest(req.body)
      break
    default:
  }
})

function base64(string) {
  return Buffer.from(string).toString('base64')
}

function credentials() {
  return base64(authorizations.github.user + ':' + authorizations.github.token)
}

function handlePullRequest(event) {
  console.log('pull request event action' + event.action)
  console.log('event ' + event.action)
  console.log('sha ' + event.pull_request.head.sha)
  if (event.action == 'labeled') {
    return
  }

  createStatusFor(event.pull_request.statuses_url)
  attachLabel(event.pull_request.issue_url + '/labels', ['team-ops', 'team-sql'])
  listAffectedFiles(event.pull_request.url + '/files')
}

function listAffectedFiles(url) {
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + credentials()
    },
  }).then(response => {
    console.log(response.status)
    return response.json();
  }).then(response => {
    console.log('files ', response)
    return response;
  }).catch(err => { console.log(err); });
}

function attachLabel(url, labels) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + credentials()
    },
    body: JSON.stringify(labels)
  }).then(response => {
    console.log(response.status)
    return response.json();
  }).then(response => {
    console.log('status ', response)
    return response;
  }).catch(err => { console.log(err); });
}

function createStatusFor(url) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + credentials()
    },
    body: JSON.stringify({
      'state': 'pending',
      'description': 'Waiting for approvals',
      'context': 'code-review/lgtm'
    })
  }).then(response => {
    console.log(response.status)
    return response.json();
  }).then(response => {
    console.log('status ', response)
    return response;
  }).catch(err => { console.log(err); });
}

app.listen(3000, () => console.log('waiting for anything on 3000'))