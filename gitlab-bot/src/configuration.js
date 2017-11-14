import fs from 'fs';

const configuration = JSON.parse(fs.readFileSync('./configuration.json', 'utf8'));

export default configuration;
