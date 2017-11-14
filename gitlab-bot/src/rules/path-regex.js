
class PathRegex {

    constructor(regex, caseInsensitive) {
        this.regex = new RegExp(regex, caseInsensitive === true ? 'i' : null);
    }

    match(diff) {
        return this.regex.match(diff.filename);
    }

}


export default PathRegex;
