import { github } from './github';
import { RulesEngine } from './rules-engine';

class Tracker {

  dispatch(request) {
    const eventType = request.headers['x-github-event'];
    console.log(`got a ${eventType}`)
    switch (eventType) {
      case 'pull_request':
        this.handlePullRequestEvent(request.body)
        break
      case 'issue_comment':
        this.handleIssueCommentEvent(request.body)
        break;
      default:
        console.log(`${eventType} has been ignored`)
    }
  }

  handlePullRequestEvent(event) {
    if (event.action === 'created') {
      github.comment(event.pull_request.comments_url, 'got it bitch, i am gonna have a look');
    }
    const diffs = github.listPRFiles(`${event.pull_request.url}/files`)
      .then(body => {
        console.log(`PR files: ${body}`)
        return body.map(entry => { return { filename: entry.filename, patch: entry.patch } });
      });

    const engine = github.get(`${event.pull_request.head.repo.url}/${event.pull_request.head.ref}/contents/.rfr`)
      .then(body => {
        console.log(`content of .rfr: ${body}`)
        if (body.type === 'file') {
          return body.content;
        }
      }).then(contentAsBase64 => github.debase64(contentAsBase64))
      .then(content => JSON.parse(content))
      .then(content => {
        console.log(`raw content of .rfr: ${content}`)
        return content;
      })
      .then(rules => new RuleEngine(rules));

    Promise.all([engine, diffs])
      .then(args => engine.match(diffs))

  }

  handleIssueCommentEvent(event) {
    console.log(event)
    const comment = event.comment.body;
    if (comment.toLowerCase().indexOf('reply') != -1) {
      github.comment(event.issue.comments_url, 'got it bitch')
    }
  }
}
export let tracker = new Tracker();
