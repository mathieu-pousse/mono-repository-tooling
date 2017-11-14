
class PathRegexRule {

    constructor(rule) {
        this.regex = new RegExp(rule.regex, rule.caseInsensitive === true ? 'i' : '');
        this.reviewers = rule.reviewers
        console.log(`PathRegexRule matching ${this.regex.source}`)
    }

    match(diffs) {
        return diffs.map(diff => {
            const result = this.regex.test(diff.filename);
            console.log(`does ${diff.filename} matches ${this.regex.source} ? ${result}`)
            return result;
        })
            .reduce((accumulator, result) => accumulator || result, false);
    }
}


export default PathRegexRule;
