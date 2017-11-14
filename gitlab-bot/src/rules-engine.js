import PathRegexRule from './rules/path-regex'

class RulesEngine {

    constructor(rules) {
        console.log('new rules engine')
        this.rules = this.build(rules);
    }

    build(rules) {
        if (!rules.version === '1.0.0') {
            throw new Error(`unknown version ${rules.version}`)
        }
        if (!rules.rules) {
            throw new Error('missing rules')
        }
        return rules.rules.map(rule => this.instantiate(rule), this)
    }

    instantiate(rule) {
        switch (rule.type) {
            case 'path-regex':
                return new PathRegexRule(rule)
            default:
                throw new Error(`unknown rule type ${rule.type}`);
        }
    }

    match(diffs) {
        var reviewers = this.rules.filter(rule => rule.match(diffs))
            .map(rule => {
                console.log('rule: ', rule)
                return rule.reviewers
            })
            .reduce((accumulator, reviewers) => accumulator.concat(reviewers), [])
        return reviewers;
    }

}

export default RulesEngine
