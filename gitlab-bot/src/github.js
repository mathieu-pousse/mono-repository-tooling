import fetch from 'node-fetch';
import configuration from './configuration'

class Github {

  base64(string) { return Buffer.from(string).toString('base64') }

  debase64(string) { return Buffer.from(string, 'base64') }

  credentials() {
    return this.base64(configuration.github.user + ':' + configuration.github.token)
  }

  post(url, payload) {
    console.log(`POST ${url}`)
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.credentials()
      },
      body: JSON.stringify(payload)
    }).then(response => {
      //console.log(`status : ${response.status}`)
      return response.json();
    }).then(response => {
      return response;
    }).catch(err => { console.log(err); });
  }

  get(url) {
    console.log(`GET ${url}`)
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.credentials()
      }
    }).then(response => {
      //console.log(`${url} status : ${response.status}`)
      return response.json();
    }).then(response => {
      //console.log(`${url} - body`, response)
      return response;
    }).catch(err => { console.log(err); });
  }

  createStatus(url) {
    this.post(url, {
      'state': 'pending',
      'description': 'Waiting for approvals',
      'context': 'code-review/lgtm'
    })
  }

  listPRFiles(url) {
    return this.get(url)
  }

  comment(url, comment) {
    console.log(`sending comment at ${url} (${comment})`)
    this.post(url, { "body": comment })
  }
}

export let github = new Github();
