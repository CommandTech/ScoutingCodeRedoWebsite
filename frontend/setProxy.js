const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('../config.ini', 'utf-8'));
const proxyUrl = config.SERVER_IP.ServerIP;

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
packageJson.proxy = proxyUrl;

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));