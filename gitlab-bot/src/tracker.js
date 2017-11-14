import { github } from './github';
import RulesEngine from './rules-engine';

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
        return body.map(entry => { return { filename: entry.filename, patch: entry.patch } });
      })
      .then(diffs => {
        console.log('diffs: ', diffs);
        return diffs
      });

    const engine = github.get(`${event.pull_request.head.repo.url}/contents/.rfr?ref=${event.pull_request.head.ref}`)
      .then(body => {
        //console.log('content of .rfr', body)
        if (body.type === 'file') {
          return body.content;
        }
      }).then(contentAsBase64 => github.debase64(contentAsBase64))
      .then(content => JSON.parse(content))
      .then(content => {
        //console.log('raw content of .rfr:', content)
        return content;
      }).then(rules => {
        return new RulesEngine(rules);
      }).catch(reason => console.error(reason));

    var reviewers = Promise.all([engine, diffs])
      .then(args => {
        const [engine, diffs] = args;
        console.log('starting engine')
        return engine.match(diffs)
      }).then(reviewers => {
        console.log('finally got this reviewers', reviewers)
        return reviewers
      }).then(mentions => {
        if (mentions.length === 0) {
          return Promise.reject('no body to mention')
        }
        return mentions;
      }).then(mentions => {
        return mentions
          .map(mention => `@${mention}`)
          .join(' ') + 'move on !'
      }).then(message => github.comment(event.pull_request.comments_url, message))
      .catch(reason => console.error(reason))
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
