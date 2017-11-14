import fs from 'fs';

if (!process.env.GITHUB_TOKEN) {
    console.error('missing GITHUB_TOKEN environment variable')
    process.exit(1)
}
const configuration = JSON.parse(fs.readFileSync('./configuration.json', 'utf8'));
configuration.github.token = process.env.GITHUB_TOKEN;
export default configuration;
